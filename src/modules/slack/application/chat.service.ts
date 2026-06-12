import { ApiError } from "@/shared/kernel";
import type { Session } from "../domain/types";
import { respondToUserMessage } from "./genaibot.service";
import { fetchDmMessages, postDmMessage } from "../infrastructure/slack-client";

export async function getChatMessages(session: Session) {
	const { messages, threadTs } = await fetchDmMessages(
		session.slackUserId,
		session.threadTs,
	);

	return {
		messages,
		threadTs: threadTs ?? session.threadTs,
	};
}

export async function sendChatMessage(session: Session, text: string) {
	const trimmed = text.trim();
	if (!trimmed) {
		throw new ApiError("text is required", 400, "BAD_REQUEST");
	}

	const result = await postDmMessage(
		session.slackUserId,
		trimmed,
		session.threadTs,
	);

	// Los mensajes web los publica el bot → Slack no dispara message.im al bot.
	// Procesamos la respuesta aquí directamente.
	await respondToUserMessage({
		slackUserId: session.slackUserId,
		channelId: result.channelId,
		threadTs: result.threadTs,
		text: trimmed,
	});

	return {
		ts: result.ts,
		threadTs: result.threadTs,
	};
}
