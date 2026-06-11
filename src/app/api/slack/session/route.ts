import { NextResponse } from "next/server";
import { getSession } from "@/lib/slack/session";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ ok: true, authenticated: false });
		}

		return NextResponse.json({
			ok: true,
			authenticated: true,
			slackUserId: session.slackUserId,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}
