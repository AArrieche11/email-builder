import { createSignedToken, verifySignedToken } from "@/shared/kernel";
import { getMagicLinkSecret } from "./config";

/** Enlace mágico de corta duración (1 hora) */
export function createMagicLinkToken(slackUserId: string): string {
	return createSignedToken(getMagicLinkSecret(), slackUserId, 60 * 60);
}

/** Cookie de sesión de larga duración (30 días) */
export function createSessionToken(slackUserId: string, threadTs?: string): string {
	return createSignedToken(getMagicLinkSecret(), slackUserId, 60 * 60 * 24 * 30, threadTs);
}

export function verifyToken(
	token: string,
): { slackUserId: string; threadTs?: string } | null {
	return verifySignedToken(getMagicLinkSecret(), token);
}
