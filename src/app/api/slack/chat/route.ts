import { NextResponse } from "next/server";
import {
	getChatMessages,
	requireSession,
	sendChatMessage,
	withSessionCookie,
} from "@/modules/slack";
import { toErrorResponse } from "@/shared/kernel";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const session = await requireSession();
		const { messages, threadTs } = await getChatMessages(session);

		const response = NextResponse.json({ ok: true, messages });
		return withSessionCookie(response, session.slackUserId, threadTs);
	} catch (error) {
		return toErrorResponse(error);
	}
}

export async function POST(request: Request) {
	try {
		const session = await requireSession();
		const body = await request.json();
		const text = typeof body.text === "string" ? body.text : "";

		const result = await sendChatMessage(session, text);

		const response = NextResponse.json({
			ok: true,
			ts: result.ts,
			threadTs: result.threadTs,
		});

		return withSessionCookie(response, session.slackUserId, result.threadTs);
	} catch (error) {
		return toErrorResponse(error);
	}
}
