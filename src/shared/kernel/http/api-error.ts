import { NextResponse } from "next/server";

export type ApiErrorCode = "UNAUTHORIZED" | "BAD_REQUEST" | "INTERNAL_ERROR";

export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly code?: ApiErrorCode,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export function toErrorResponse(error: unknown): NextResponse {
	if (error instanceof ApiError) {
		return NextResponse.json(
			{ ok: false, error: error.message, ...(error.code ? { code: error.code } : {}) },
			{ status: error.status },
		);
	}

	const message = error instanceof Error ? error.message : "Unknown error";
	return NextResponse.json({ ok: false, error: message }, { status: 500 });
}
