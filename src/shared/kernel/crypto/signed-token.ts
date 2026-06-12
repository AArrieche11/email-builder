import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_SEP = ".";

type TokenPayload = {
	slackUserId: string;
	exp: number;
	threadTs?: string;
};

export function createSignedToken(
	secret: string,
	slackUserId: string,
	ttlSeconds: number,
	threadTs?: string,
): string {
	const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
	const payload: TokenPayload = { slackUserId, exp, ...(threadTs ? { threadTs } : {}) };
	const payloadB64 = encodePayload(payload);
	return `${payloadB64}${TOKEN_SEP}${sign(secret, payloadB64)}`;
}

export function verifySignedToken(
	secret: string,
	token: string,
): { slackUserId: string; threadTs?: string } | null {
	const sepIndex = token.lastIndexOf(TOKEN_SEP);
	if (sepIndex === -1) return null;

	const payloadB64 = token.slice(0, sepIndex);
	const signature = token.slice(sepIndex + 1);
	if (!payloadB64 || !signature) return null;

	const expected = sign(secret, payloadB64);
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

		return {
			slackUserId: payload.slackUserId,
			threadTs: payload.threadTs,
		};
	} catch {
		return null;
	}
}

function sign(secret: string, data: string): string {
	return createHmac("sha256", secret).update(data).digest("base64url");
}

function encodePayload(payload: TokenPayload): string {
	return Buffer.from(JSON.stringify(payload)).toString("base64url");
}
