import { LINK_KEYWORDS, WEB_MESSAGE_PREFIX } from "../domain/constants";
import { buildMagicLink } from "../infrastructure/magic-link";
import { getSlackWebClient } from "../infrastructure/slack-client";

function shouldSendMagicLink(text: string): boolean {
	const normalized = text.toLowerCase();
	return LINK_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function countUserMessages(
	messages: Array<{ text?: string; user?: string; bot_id?: string }> | undefined,
	slackUserId: string,
): number {
	return (
		messages?.filter((entry) => {
			const text = entry.text ?? "";
			if (text.startsWith(WEB_MESSAGE_PREFIX) && entry.bot_id) return true;
			return entry.user === slackUserId && !entry.bot_id;
		}).length ?? 0
	);
}

function buildAssistantReply(text: string): string {
	return [
		"Entendido. Soy *GENAIBOT* y te ayudo con textos para emails.",
		`Sobre *"${text}"*: contame el contexto del mailing (producto, tono, idioma) y qué bloque necesitás (asunto, intro, CTA, cierre).`,
		"Si querés seguir en el Email Builder, escribí *link* o *web* y te envío el enlace.",
	].join("\n");
}

export async function respondToUserMessage(params: {
	slackUserId: string;
	channelId: string;
	threadTs: string;
	text: string;
}) {
	const client = getSlackWebClient();
	const { slackUserId, channelId, threadTs, text } = params;

	const history = await client.conversations.replies({
		channel: channelId,
		ts: threadTs,
		limit: 20,
	});

	const userMessageCount = countUserMessages(history.messages, slackUserId);
	const isFirstMessage = userMessageCount <= 1;
	const wantsLink = shouldSendMagicLink(text);

	if (isFirstMessage || wantsLink) {
		const magicLink = buildMagicLink(slackUserId);

		if (isFirstMessage) {
			await client.chat.postMessage({
				channel: channelId,
				thread_ts: threadTs,
				text: [
					"¡Hola! Soy *GENAIBOT*, tu asistente para construir textos de email.",
					"Contame qué necesitás y te ayudo con copys, asuntos y bloques de contenido.",
					"",
					`Para continuar en el Email Builder, abrí este enlace (válido 1 hora):\n${magicLink}`,
				].join("\n"),
			});
			return;
		}

		await client.chat.postMessage({
			channel: channelId,
			thread_ts: threadTs,
			text: `Abrí el Email Builder con tu conversación privada:\n${magicLink}`,
		});
		return;
	}

	await client.chat.postMessage({
		channel: channelId,
		thread_ts: threadTs,
		text: buildAssistantReply(text),
	});
}
