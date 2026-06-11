import { createHmac, timingSafeEqual } from "crypto";
import { getMagicLinkSecret } from "./env";

const TOKEN_SEP = ".";

type TokenPayload = {
	slackUserId: string;
	exp: number;
};

function sign(data: string): string {
	return createHmac("sha256", getMagicLinkSecret()).update(data).digest("base64url");
}

export function createSignedToken(slackUserId: string, ttlSeconds: number): string {
	const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
	const payloadB64 = Buffer.from(JSON.stringify({ slackUserId, exp } satisfies TokenPayload))
		.toString("base64url");
	return `${payloadB64}${TOKEN_SEP}${sign(payloadB64)}`;
}

/** Enlace mágico de corta duración (1 hora) */
export function createMagicLinkToken(slackUserId: string): string {
	return createSignedToken(slackUserId, 60 * 60);
}

/** Cookie de sesión de larga duración (30 días) */
export function createSessionToken(slackUserId: string): string {
	return createSignedToken(slackUserId, 60 * 60 * 24 * 30);
}

export function verifyToken(token: string): { slackUserId: string } | null {
	const sepIndex = token.lastIndexOf(TOKEN_SEP);
	if (sepIndex === -1) return null;

	const payloadB64 = token.slice(0, sepIndex);
	const signature = token.slice(sepIndex + 1);
	if (!payloadB64 || !signature) return null;

	const expected = sign(payloadB64);
	const sigBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);

	if (sigBuffer.length !== expectedBuffer.length) return null;
	if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

	try {
		const payload = JSON.parse(
			Buffer.from(payloadB64, "base64url").toString("utf8"),
		) as TokenPayload;

		if (!payload.slackUserId || typeof payload.exp !== "number") return null;
		if (payload.exp < Math.floor(Date.now() / 1000)) return null;

		return { slackUserId: payload.slackUserId };
	} catch {
		return null;
	}
}
