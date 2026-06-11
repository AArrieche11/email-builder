import { createHandler, type VercelHandler } from "@vercel/slack-bolt";
import { getApp, getReceiver } from "@/lib/slack/bolt-app";

export const dynamic = "force-dynamic";

let slackHandler: VercelHandler | null = null;

function getSlackHandler(): VercelHandler {
	if (!slackHandler) {
		slackHandler = createHandler(getApp(), getReceiver());
	}
	return slackHandler;
}

export async function POST(request: Request) {
	try {
		return await getSlackHandler()(request);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Internal server error";
		return Response.json({ error: message }, { status: 500 });
	}
}
