import { requireAuth } from '@/features/auth/middlewares/require-auth';
import { db } from '@/lib/db';
import { queryOptions } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import {
	type GetRunDetailSchema,
	type GetRunListSchema,
	getRunDetailSchema,
	getRunListSchema,
} from '../schemas/schemas';
import { member } from '../schemas/tables';

const getRunList = createServerFn({ method: 'GET' })
	.middleware([requireAuth])
	.validator((data: GetRunListSchema) => getRunListSchema.parse(data))
	.handler(async ({ context, data }) => {
		// Can't filtere by member's userId as seen here:
		// https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0280#removed-support-for-filtering-by-nested-relations

		const runs = await db.query.run.findMany({
			where: (table, { eq }) => eq(table.status, data.status),
			with: {
				members: true,
			},
		});

		const userRuns = runs.filter((run) =>
			run.members.some((member) => member.userId === context.user.id),
		);

		const runDTO = userRuns.map(({ id, code, name }) => ({
			id,
			code,
			name,
		}));

		return runDTO;
	});

export type Run = Awaited<ReturnType<typeof getRunList>>[number];

const getRunDetail = createServerFn({ method: 'GET' })
	.validator((data: GetRunDetailSchema) => getRunDetailSchema.parse(data))
	.handler(async ({ data }) => {
		const run = await db.query.run.findFirst({
			where: (table, { eq }) => eq(table.code, data.code),
		});
		if (!run) {
			throw notFound();
		}
		return run;
	});

export const runQueries = {
	all: () => ({ key: () => ['run'] as const }),
	list: (data: GetRunListSchema) => {
		const key = [...runQueries.all().key(), 'list', data.status] as const;
		return {
			key: () => key,
			opts: () =>
				queryOptions({
					queryKey: key,
					queryFn: () => getRunList({ data }),
				}),
			useOpts: () => {
				const serverFn = useServerFn(getRunList);
				return queryOptions({
					queryKey: key,
					queryFn: () => serverFn({ data }),
				});
			},
		};
	},
	detail: (data: GetRunDetailSchema) => {
		const key = [...runQueries.all().key(), 'detail', data.code] as const;
		return {
			key: () => key,
			opts: () =>
				queryOptions({
					queryKey: key,
					queryFn: () => getRunDetail({ data }),
				}),
			useOpts: () => {
				const serverFn = useServerFn(getRunDetail);
				return queryOptions({
					queryKey: key,
					queryFn: () => serverFn({ data }),
				});
			},
		};
	},
};
