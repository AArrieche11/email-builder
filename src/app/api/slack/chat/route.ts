import { NextResponse } from "next/server";
import { fetchDmMessages, postDmMessage } from "@/lib/slack/client";
import { getSession } from "@/lib/slack/session";

export const dynamic = "force-dynamic";

function unauthorized() {
	return NextResponse.json(
		{
			ok: false,
			error: "Sesión no válida. Abrí el enlace que GENAIBOT te envió en Slack.",
			code: "UNAUTHORIZED",
		},
		{ status: 401 },
	);
}

export async function GET() {
	try {
		const session = await getSession();
		if (!session) return unauthorized();

		const messages = await fetchDmMessages(session.slackUserId);

		return NextResponse.json({ ok: true, messages });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const session = await getSession();
		if (!session) return unauthorized();

		const body = await request.json();
		const text = typeof body.text === "string" ? body.text.trim() : "";

		if (!text) {
			return NextResponse.json(
				{ ok: false, error: "text is required" },
				{ status: 400 },
			);
		}

		const result = await postDmMessage(session.slackUserId, text);

		return NextResponse.json({
			ok: true,
			ts: result.ts,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}
