import { WebClient } from "@slack/web-api";
import { getSlackBotToken } from "./env";

let webClient: WebClient | null = null;
let botUserId: string | null = null;

export function getSlackWebClient(): WebClient {
	if (!webClient) {
		webClient = new WebClient(getSlackBotToken());
	}
	return webClient;
}

async function getBotUserId(): Promise<string> {
	if (botUserId) return botUserId;

	const client = getSlackWebClient();
	const auth = await client.auth.test();

	if (!auth.ok || !auth.user_id) {
		throw new Error(auth.error ?? "Failed to resolve GENAIBOT user id");
	}

	botUserId = auth.user_id;
	return botUserId;
}

export async function openDmChannel(slackUserId: string): Promise<string> {
	const client = getSlackWebClient();
	const result = await client.conversations.open({ users: slackUserId });

	if (!result.ok || !result.channel?.id) {
		throw new Error(result.error ?? "Failed to open DM with GENAIBOT");
	}

	return result.channel.id;
}

export type ChatMessage = {
	id: string;
	text: string;
	ts: string;
	isFromBot: boolean;
};

const WEB_MESSAGE_PREFIX = "[Web]";

function mapSlackMessages(
	messages: Array<{ text?: string; ts?: string; bot_id?: string; user?: string; subtype?: string }>,
	slackUserId: string,
	botId: string,
	fallbackId: string,
): ChatMessage[] {
	return messages
		.filter((message) => Boolean(message.text) && !message.subtype)
		.map((message) => {
			const rawText = message.text ?? "";
			const isWebMessage = rawText.startsWith(WEB_MESSAGE_PREFIX);
			const isFromBot =
				!isWebMessage && (Boolean(message.bot_id) || message.user === botId);

			const displayText = isWebMessage
				? rawText.slice(WEB_MESSAGE_PREFIX.length).trimStart()
				: rawText;

			return {
				id: message.ts ?? `${fallbackId}-${rawText}`,
				text: displayText,
				ts: message.ts ?? "",
				isFromBot,
			};
		})
		.sort((a, b) => Number(a.ts) - Number(b.ts));
}

/**
 * Slack Agents & AI Apps agrupan cada conversación en un hilo (thread).
 * La pestaña Chat muestra el hilo activo; History lista hilos sueltos.
 * Hay que publicar con thread_ts para que los mensajes web aparezcan en Chat.
 * @see https://docs.slack.dev/ai/developing-agents
 */
export async function resolveActiveThreadTs(
	slackUserId: string,
	hint?: string | null,
): Promise<string | undefined> {
	if (hint) return hint;

	const client = getSlackWebClient();
	const botId = await getBotUserId();
	const channelId = await openDmChannel(slackUserId);

	const result = await client.conversations.history({
		channel: channelId,
		limit: 50,
	});

	const messages = (result.messages ?? [])
		.filter((message) => !message.subtype)
		.sort((a, b) => Number(b.ts) - Number(a.ts));

	for (const message of messages) {
		const text = message.text ?? "";
		if (text.startsWith(WEB_MESSAGE_PREFIX) && !message.thread_ts) continue;

		if (message.user === slackUserId && !message.bot_id) {
			return message.thread_ts ?? message.ts;
		}
	}

	for (const message of messages) {
		const text = message.text ?? "";
		if (text.startsWith(WEB_MESSAGE_PREFIX) && !message.thread_ts) continue;

		if (message.thread_ts) return message.thread_ts;
		if (message.bot_id || message.user === botId) return message.ts;
	}

	return undefined;
}

export async function postDmMessage(
	slackUserId: string,
	text: string,
	threadTsHint?: string | null,
) {
	const client = getSlackWebClient();
	const channelId = await openDmChannel(slackUserId);
	const threadTs = await resolveActiveThreadTs(slackUserId, threadTsHint);

	const result = await client.chat.postMessage({
		channel: channelId,
		text: `${WEB_MESSAGE_PREFIX} ${text}`,
		...(threadTs ? { thread_ts: threadTs } : {}),
	});

	if (!result.ok || !result.ts) {
		throw new Error(result.error ?? "Failed to post message to GENAIBOT");
	}

	return {
		ts: result.ts,
		channelId,
		threadTs: threadTs ?? result.ts,
	};
}

export async function fetchDmMessages(
	slackUserId: string,
	threadTsHint?: string | null,
): Promise<{ messages: ChatMessage[]; threadTs?: string }> {
	const client = getSlackWebClient();
	const botId = await getBotUserId();
	const channelId = await openDmChannel(slackUserId);
	const threadTs = await resolveActiveThreadTs(slackUserId, threadTsHint);

	let rawMessages;

	if (threadTs) {
		const result = await client.conversations.replies({
			channel: channelId,
			ts: threadTs,
			limit: 100,
		});

		if (!result.ok || !result.messages) {
			throw new Error(result.error ?? "Failed to fetch DM thread");
		}

		rawMessages = result.messages;
	} else {
		const result = await client.conversations.history({
			channel: channelId,
			limit: 100,
		});

		if (!result.ok || !result.messages) {
			throw new Error(result.error ?? "Failed to fetch DM history");
		}

		rawMessages = result.messages;
	}

	return {
		messages: mapSlackMessages(rawMessages, slackUserId, botId, channelId),
		threadTs,
	};
}
