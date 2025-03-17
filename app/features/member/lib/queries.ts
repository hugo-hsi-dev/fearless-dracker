import { db } from '@/lib/db';
import { queryOptions } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import {
	type GetMemberListSchema,
	getMemberListSchema,
} from '../schemas/schemas';

const getMemberList = createServerFn({ method: 'GET' })
	.validator((data: GetMemberListSchema) => getMemberListSchema.parse(data))
	.handler(async ({ data }) => {
		const run = await db.query.run.findFirst({
			where: (table, { eq }) => eq(table.code, data.code),
			columns: {},
			with: {
				members: {
					columns: { role: true },
					with: {
						user: {
							columns: { id: true, name: true, image: true },
						},
					},
				},
			},
		});

		if (!run) {
			throw notFound();
		}

		const members = run.members.map(({ user, role }) => ({ role, ...user }));
		return members;
	});

export const memberQueries = {
	all: () => ({ key: ['member'] as const }),
	list: (data: GetMemberListSchema) => {
		const key = [...memberQueries.all().key, 'list', data.code] as const;
		return {
			key: () => key,
			opts: () =>
				queryOptions({
					queryKey: key,
					queryFn: () => getMemberList({ data }),
				}),
			useOpts: () => {
				const serverFn = useServerFn(getMemberList);
				return queryOptions({
					queryKey: key,
					queryFn: () => serverFn({ data }),
				});
			},
		};
	},
};
