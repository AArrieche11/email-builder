function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
}

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
