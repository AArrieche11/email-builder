import { NextResponse } from "next/server";
import { getSessionStatus } from "@/modules/slack";
import { toErrorResponse } from "@/shared/kernel";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const status = await getSessionStatus();

		if (!status.authenticated) {
			return NextResponse.json({ ok: true, authenticated: false });
		}

		return NextResponse.json({
			ok: true,
			authenticated: true,
			slackUserId: status.slackUserId,
		});
	} catch (error) {
		return toErrorResponse(error);
	}
}
