import { App } from "@slack/bolt";
import { VercelReceiver } from "@vercel/slack-bolt";
import { respondToUserMessage } from "../application/genaibot.service";
import { getSlackBotToken, getSlackSigningSecret } from "./config";

let receiver: VercelReceiver | null = null;
let app: App | null = null;

function getReceiver(): VercelReceiver {
	if (!receiver) {
		receiver = new VercelReceiver({
			signingSecret: getSlackSigningSecret(),
		});
	}
	return receiver;
}

function getThreadTs(message: { ts?: string; thread_ts?: string }): string | undefined {
	return message.thread_ts ?? message.ts;
}

function getApp(): App {
	if (!app) {
		const slackReceiver = getReceiver();
		app = new App({
			token: getSlackBotToken(),
			signingSecret: getSlackSigningSecret(),
			receiver: slackReceiver,
			deferInitialization: true,
			processBeforeResponse: true,
		});

		app.message(async ({ message, logger }) => {
			if (message.subtype) return;
			// Ignorar mensajes del bot excepto los reenviados desde la web ([Web] ...)
			if ("bot_id" in message && message.bot_id) return;
			if (message.channel_type !== "im") return;

			const userId = message.user;
			const text = "text" in message ? message.text ?? "" : "";
			const threadTs = getThreadTs(message);

			if (!userId || !threadTs) return;

			logger.info("GENAIBOT DM received", { userId, channel: message.channel, threadTs });

			await respondToUserMessage({
				slackUserId: userId,
				channelId: message.channel,
				threadTs,
				text,
			});
		});
	}
	return app;
}

export { getApp, getReceiver };
