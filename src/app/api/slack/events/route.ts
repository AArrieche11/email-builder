import { createHandler } from "@vercel/slack-bolt";
import { getApp, getReceiver } from "@/lib/slack/bolt-app";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	const handler = createHandler(getApp(), getReceiver());
	return handler(request);
}
