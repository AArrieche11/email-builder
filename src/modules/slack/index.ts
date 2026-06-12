/**
 * Módulo Slack — API pública del bounded context.
 * El resto de la app solo debe importar desde este archivo.
 */

// Application (casos de uso)
export { getChatMessages, sendChatMessage } from "./application/chat.service";
export {
	getSessionStatus,
	redeemMagicLink,
	requireSession,
	withSessionCookie,
} from "./application/auth.service";
export { respondToUserMessage } from "./application/genaibot.service";

// Infrastructure (adaptadores expuestos para el entrypoint HTTP de eventos)
export { getApp, getReceiver } from "./infrastructure/bolt-app";

// Domain (tipos públicos)
export type { ChatMessage, Session } from "./domain/types";
