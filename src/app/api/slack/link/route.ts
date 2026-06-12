import { redeemMagicLink } from "@/modules/slack";
import { toErrorResponse } from "@/shared/kernel";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		return redeemMagicLink(searchParams.get("token"), request.url);
	} catch (error) {
		return toErrorResponse(error);
	}
}
