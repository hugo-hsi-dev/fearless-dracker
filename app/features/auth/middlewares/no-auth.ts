import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { maybeAuth } from './maybe-auth';

export const noAuth = createMiddleware()
	.middleware([maybeAuth])
	.server(async ({ next, context }) => {
		const user = context.user;
		if (user) {
			throw redirect({ to: '/app' });
		}
		return next({ context: { user: null } });
	});
