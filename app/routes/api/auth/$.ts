import { auth } from '@/features/auth/lib/auth';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import { getWebRequest } from '@tanstack/react-start/server';

export const APIRoute = createAPIFileRoute('/api/auth/$')({
	GET: ({ request }) => {
		return auth.handler(request);
	},
	POST: ({ request }) => {
		return auth.handler(request);
	},
});
