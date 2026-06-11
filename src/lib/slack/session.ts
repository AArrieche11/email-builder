import { cookies } from "next/headers";
import { verifyToken } from "./token";

export const SESSION_COOKIE = "genaibot_session";

export async function getSession(): Promise<{ slackUserId: string } | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(SESSION_COOKIE)?.value;
	if (!token) return null;
	return verifyToken(token);
}
