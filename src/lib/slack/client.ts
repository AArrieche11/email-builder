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

export async function postDmMessage(slackUserId: string, text: string) {
	const client = getSlackWebClient();
	const channelId = await openDmChannel(slackUserId);

	const result = await client.chat.postMessage({
		channel: channelId,
		text: `${WEB_MESSAGE_PREFIX} ${text}`,
	});

	if (!result.ok || !result.ts) {
		throw new Error(result.error ?? "Failed to post message to GENAIBOT");
	}

	return { ts: result.ts, channelId };
}

export async function fetchDmMessages(slackUserId: string): Promise<ChatMessage[]> {
	const client = getSlackWebClient();
	const botId = await getBotUserId();
	const channelId = await openDmChannel(slackUserId);

	const result = await client.conversations.history({
		channel: channelId,
		limit: 100,
	});

	if (!result.ok || !result.messages) {
		throw new Error(result.error ?? "Failed to fetch DM history");
	}

	return result.messages
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
				id: message.ts ?? `${channelId}-${rawText}`,
				text: displayText,
				ts: message.ts ?? "",
				isFromBot,
			};
		})
		.sort((a, b) => Number(a.ts) - Number(b.ts));
}
