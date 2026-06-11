import { App } from "@slack/bolt";
import { VercelReceiver } from "@vercel/slack-bolt";
import { getSlackBotToken, getSlackSigningSecret } from "./env";
import { buildMagicLink } from "./magic-link";

let receiver: VercelReceiver | null = null;
let app: App | null = null;

const LINK_KEYWORDS = ["web", "builder", "enlace", "link", "email builder"];

function getReceiver(): VercelReceiver {
	if (!receiver) {
		receiver = new VercelReceiver({
			signingSecret: getSlackSigningSecret(),
		});
	}
	return receiver;
}

function shouldSendMagicLink(text: string): boolean {
	const normalized = text.toLowerCase();
	return LINK_KEYWORDS.some((keyword) => normalized.includes(keyword));
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

		app.message(async ({ message, say, client, logger }) => {
			if (message.subtype) return;
			if ("bot_id" in message && message.bot_id) return;
			if (message.channel_type !== "im") return;

			const userId = message.user;
			const text = "text" in message ? message.text ?? "" : "";

			if (!userId) return;

			logger.info("GENAIBOT DM received", { userId, channel: message.channel });

			const history = await client.conversations.history({
				channel: message.channel,
				limit: 5,
			});

			const userMessageCount =
				history.messages?.filter(
					(entry) => entry.user === userId && !entry.bot_id && !entry.subtype,
				).length ?? 0;

			const isFirstMessage = userMessageCount <= 1;
			const wantsLink = shouldSendMagicLink(text);

			if (isFirstMessage || wantsLink) {
				const magicLink = buildMagicLink(userId);

				if (isFirstMessage) {
					await say({
						text: [
							"¡Hola! Soy *GENAIBOT*, tu asistente para construir textos de email.",
							"Contame qué necesitás y te ayudo con copys, asuntos y bloques de contenido.",
							"",
							`Para continuar en el Email Builder, abrí este enlace (válido 1 hora):\n${magicLink}`,
						].join("\n"),
					});
					return;
				}

				await say(
					`Abrí el Email Builder con tu conversación privada:\n${magicLink}`,
				);
			}
		});
	}
	return app;
}

export { getApp, getReceiver };
