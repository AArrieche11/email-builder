import { getAppBaseUrl } from "./config";
import { createMagicLinkToken } from "./token";

export function buildMagicLink(slackUserId: string): string {
	const token = createMagicLinkToken(slackUserId);
	return `${getAppBaseUrl()}/api/slack/link?token=${encodeURIComponent(token)}`;
}
