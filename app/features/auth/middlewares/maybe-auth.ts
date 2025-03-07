import { createMiddleware } from "@tanstack/react-start";
import { getHeaders, getWebRequest } from "@tanstack/react-start/server";
import type { User } from "better-auth";
import { auth } from "../lib/auth";

export const maybeAuth = createMiddleware().server(async ({ next }) => {
	const request = getWebRequest();
	if (!request) {
		throw new Error("Request is missing");
	}
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		return next({ context: { user: null as User | null } });
	}

	return next({ context: { user: session.user as User | null } });
});
