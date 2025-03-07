import { queryOptions, useQuery } from "@tanstack/react-query";

import { createServerFn, useServerFn } from "@tanstack/react-start";
import { createServer } from "@tanstack/react-start/server";
import { maybeAuth } from "../middlewares/maybe-auth";
import { noAuth } from "../middlewares/no-auth";
import { requireAuth } from "../middlewares/require-auth";

const getMaybeAuth = createServerFn({ method: "GET" })
	.middleware([maybeAuth])
	.handler(({ context }) => {
		return context.user;
	});

export const getRequiredAuth = createServerFn({ method: "GET" })
	.middleware([requireAuth])
	.handler(({ context }) => {
		return context.user;
	});

const ensureNoAuth = createServerFn({ method: "GET" })
	.middleware([noAuth])
	.handler(() => {
		return null;
	});

export const authQueries = {
	all: () => ({ key: ["auth"] as const }),
	maybe: () => {
		const key = [...authQueries.all().key, "maybe"] as const;
		return {
			key: () => key,
			opts: () =>
				queryOptions({ queryKey: key, queryFn: () => getMaybeAuth() }),
			useOpts: () => {
				const serverFn = useServerFn(getMaybeAuth);
				return queryOptions({ queryKey: key, queryFn: () => serverFn() });
			},
		};
	},
	no: () => {
		const key = [...authQueries.all().key, "no"] as const;
		return {
			key: () => key,
			opts: () =>
				queryOptions({ queryKey: key, queryFn: () => ensureNoAuth() }),
			useOpts: () => {
				const serverFn = useServerFn(ensureNoAuth);
				return queryOptions({ queryKey: key, queryFn: () => serverFn() });
			},
		};
	},
	required: () => {
		const key = [...authQueries.all().key, "required"] as const;
		return {
			key: () => key,
			opts: () =>
				queryOptions({ queryKey: key, queryFn: () => getRequiredAuth() }),
			useOpts: () => {
				const serverFn = useServerFn(getRequiredAuth);
				return queryOptions({ queryKey: key, queryFn: () => serverFn() });
			},
		};
	},
};
