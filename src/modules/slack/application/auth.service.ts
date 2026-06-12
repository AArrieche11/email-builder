import { NextResponse } from "next/server";
import { ApiError } from "@/shared/kernel";
import type { Session } from "../domain/types";
import { attachSessionCookie, getSession } from "../infrastructure/session-store";
import { verifyToken } from "../infrastructure/token";

export async function requireSession(): Promise<Session> {
	const session = await getSession();
	if (!session) {
		throw new ApiError(
			"Sesión no válida. Abrí el enlace que GENAIBOT te envió en Slack.",
			401,
			"UNAUTHORIZED",
		);
	}
	return session;
}

export async function getSessionStatus() {
	const session = await getSession();

	if (!session) {
		return { authenticated: false as const };
	}

	return {
		authenticated: true as const,
		slackUserId: session.slackUserId,
	};
}

export function redeemMagicLink(token: string | null, requestUrl: string) {
	if (!token) {
		throw new ApiError("token query parameter is required", 400, "BAD_REQUEST");
	}

	const session = verifyToken(token);
	if (!session) {
		throw new ApiError("Invalid or expired link", 401, "UNAUTHORIZED");
	}

	const redirectUrl = new URL("/", requestUrl);
	redirectUrl.searchParams.set("chat", "open");

	const response = NextResponse.redirect(redirectUrl);
	return attachSessionCookie(response, session.slackUserId);
}

export function withSessionCookie(
	response: NextResponse,
	slackUserId: string,
	threadTs?: string,
) {
	return attachSessionCookie(response, slackUserId, threadTs);
}
