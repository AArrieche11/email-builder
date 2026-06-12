import { requireEnv } from "@/shared/kernel";

export function getSlackBotToken(): string {
	return requireEnv("SLACK_BOT_TOKEN");
}

export function getSlackSigningSecret(): string {
	return requireEnv("SLACK_SIGNING_SECRET");
}

export function getMagicLinkSecret(): string {
	return requireEnv("SLACK_MAGIC_LINK_SECRET");
}

export function getAppBaseUrl(): string {
	return requireEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/, "");
}
