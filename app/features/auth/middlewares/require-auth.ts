import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { maybeAuth } from "./maybe-auth";

export const requireAuth = createMiddleware()
	.middleware([maybeAuth])
	.server(async ({ next, context }) => {
		const user = context.user;
		if (!user) {
			throw redirect({ to: "/sign-in" });
		}
		return next({ context: { user } });
	});
