import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/slack/token";
import { attachSessionCookie } from "@/lib/slack/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.json(
			{ ok: false, error: "token query parameter is required" },
			{ status: 400 },
		);
	}

	const session = verifyToken(token);
	if (!session) {
		return NextResponse.json(
			{ ok: false, error: "Invalid or expired link" },
			{ status: 401 },
		);
	}

	const redirectUrl = new URL("/", request.url);
	redirectUrl.searchParams.set("chat", "open");

	const response = NextResponse.redirect(redirectUrl);
	return attachSessionCookie(response, session.slackUserId);
}
