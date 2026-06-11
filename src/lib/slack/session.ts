import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, verifyToken } from "./token";

export const SESSION_COOKIE = "genaibot_session";

const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	maxAge: 60 * 60 * 24 * 30,
	path: "/",
};

export type Session = {
	slackUserId: string;
	threadTs?: string;
};

export async function getSession(): Promise<Session | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;
	if (!token) return null;
	return verifyToken(token);
}

export function attachSessionCookie(
	response: NextResponse,
	slackUserId: string,
	threadTs?: string,
): NextResponse {
	response.cookies.set(
		SESSION_COOKIE,
		createSessionToken(slackUserId, threadTs),
		SESSION_COOKIE_OPTIONS,
	);
	return response;
}
