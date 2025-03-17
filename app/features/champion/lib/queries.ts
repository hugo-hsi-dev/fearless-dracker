import { db } from '@/lib/db';
import { queryOptions } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';
import { createServerFn, useServerFn } from '@tanstack/react-start';
import {
	type GetChampionAvailabilitiesSchema,
	type GetReservedChampionsSchema,
	getChampionAvailabilitiesSchema,
	getReservedChampionsSchema,
} from '../schemas/schemas';

const getChampionAvailabilities = createServerFn({ method: 'GET' })
	.validator((data: GetChampionAvailabilitiesSchema) =>
		getChampionAvailabilitiesSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const champions = await db.transaction(async (tx) => {
			const run = await tx.query.run.findFirst({
				where: (table, { eq }) => eq(table.code, data.code),
			});
			if (!run) {
				throw notFound();
			}
			const champions = await tx.query.champion.findMany({
				with: {
					reserved: {
						where: (table, { eq }) => eq(table.runId, run.id),
						columns: { runId: false },
					},
				},
				where: (table, { ilike }) =>
					data.name.length > 0
						? ilike(table.name, `%${data.name}%`)
						: undefined,
				orderBy: (table, { asc }) => asc(table.name),
			});
			const championsWithAvailability = champions.map(
				({ reserved, ...rest }) => ({
					...rest,
					reserved: reserved.length > 0,
				}),
			);
			return championsWithAvailability;
		});
		return champions;
	});

const getReservedChampions = createServerFn({ method: 'GET' })
	.validator((data: GetReservedChampionsSchema) =>
		getReservedChampionsSchema.parse(data),
	)
	.handler(async ({ data }) => {
		const reservedChampions = await db.transaction(async (tx) => {
			const run = await tx.query.run.findFirst({
				columns: { id: true },
				where: (table, { eq }) => eq(table.code, data.code),
			});

			if (!run) {
				throw notFound();
			}

			const reservedChampions = await tx.query.reservedChampion.findMany({
				columns: {},
				where: (table, { eq }) => eq(table.runId, run.id),
				orderBy: (table, { desc }) => desc(table.createdAt),
				with: {
					champion: {
						columns: { id: true, name: true, image: true },
					},
				},
			});
			return reservedChampions.map(({ champion }) => champion);
		});
		return reservedChampions;
	});

export const championQueries = {
	all: () => ({ key: () => ['champion'] as const }),
	availability: (data: GetChampionAvailabilitiesSchema) => {
		const key = [
			...championQueries.all().key(),
			'availability',
			data.code,
			data.name,
		] as const;
		return {
			opts: () =>
				queryOptions({
					queryKey: key,
					queryFn: () => getChampionAvailabilities({ data }),
				}),
			useOpts: () => {
				const serverFn = useServerFn(getChampionAvailabilities);
				return queryOptions({
					queryKey: key,
					queryFn: () => serverFn({ data }),
				});
			},
		};
	},
	reserved: (data: GetReservedChampionsSchema) => {
		const key = [
			...championQueries.all().key(),
			'reserved',
			data.code,
		] as const;

		return {
			opts: () =>
				queryOptions({
					queryKey: key,
					queryFn: () => getReservedChampions({ data }),
				}),
			useOpts: () => {
				const serverFn = useServerFn(getReservedChampions);
				return queryOptions({
					queryKey: key,
					queryFn: () => serverFn({ data }),
				});
			},
		};
	},
};
