import { auth } from '@/features/auth/lib/auth';
import { requireAuth } from '@/features/auth/middlewares/require-auth';
import { db } from '@/lib/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { run } from '../schemas/tables';

import { member } from '@/features/member/schemas/tables';
import { eq } from 'drizzle-orm';
import {
	type CreateRunSchema,
	type UpdateRunStatusSchema,
	createRunSchema,
	updateRunStatusSchema,
} from '../schemas/schemas';
import { Run, runQueries } from './queries';

const createRun = createServerFn({ method: 'POST' })
	.middleware([requireAuth])
	.validator((data: CreateRunSchema) => createRunSchema.parse(data))
	.handler(async ({ data, context }) => {
		return await db.transaction(async (tx) => {
			const [{ runId, runCode }] = await tx
				.insert(run)
				.values({ name: data.name })
				.returning({ runId: run.id, runCode: run.code });
			await tx
				.insert(member)
				.values({ userId: context.user.id, runId, role: 'owner' });
			return { runCode };
		});
	});

const updateRunStatus = createServerFn({ method: 'POST' })
	.middleware([requireAuth])
	.validator((data: UpdateRunStatusSchema) => updateRunStatusSchema.parse(data))
	.handler(async ({ data, context }) => {
		await db.transaction(async (tx) => {
			const runData = await tx.query.run.findFirst({
				where: (table, { eq }) => eq(table.code, data.code),
			});
			if (!run) {
				throw new Error('Run not found');
			}
			await tx.update(run).set(data).where(eq(run.code, data.code));
		});
	});

export const runMutations = {
	useCreate: () => {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (data: CreateRunSchema) => createRun({ data }),
			onSuccess: ({ runCode }) => {
				queryClient.invalidateQueries({
					queryKey: runQueries.list({ status: 'active' }).key(),
				});
				throw redirect({ to: '/app/$runCode', params: { runCode } });
			},
		});
	},
	useUpdateStatus: () => {
		const queryClient = useQueryClient();
		return useMutation({
			mutationFn: (data: UpdateRunStatusSchema) => updateRunStatus({ data }),
			onMutate: async (data) => {
				await queryClient.cancelQueries({ queryKey: runQueries.all().key() });

				const previousRun = queryClient.getQueryData(
					runQueries.detail({ code: data.code }).opts().queryKey,
				);
				if (previousRun) {
					queryClient.setQueryData(
						runQueries.detail({ code: data.code }).opts().queryKey,
						{ ...previousRun, status: data.status },
					);
				}
				return { previousRun, data };
			},
			onError: (err, data, context) => {
				if (context?.previousRun) {
					queryClient.setQueryData(
						runQueries.detail({ code: data.code }).opts().queryKey,
						context.previousRun,
					);
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: runQueries.all().key() });
			},
		});
	},
};
