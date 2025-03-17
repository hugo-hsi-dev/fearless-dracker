import { requireAuth } from '@/features/auth/middlewares/require-auth';
import useAvailabilitySearch from '@/hooks/use-availability-search';
import { db } from '@/lib/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notFound, useSearch } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { createServer } from '@tanstack/react-start/server';
import { and, eq } from 'drizzle-orm';
import { toast } from 'sonner';
import {
	type ToggleChampionSchema,
	toggleChampionSchema,
} from '../schemas/schemas';
import {
	champion,
	reservedChampion as reservedChampionTable,
} from '../schemas/tables';
import { championQueries } from './queries';

type ChampionApiData = {
	type: string;
	format: string;
	version: string;
	data: Record<
		string,
		{
			version: string;
			id: string;
			key: string;
			name: string;
			title: string;
			blurb: string;
			info: Record<string, number>;
			image: {
				full: string;
				sprite: string;
				group: string;
				x: number;
				y: number;
				w: number;
				h: number;
			};
			tags: (
				| 'Fighter'
				| 'Mage'
				| 'Assassin'
				| 'Marksman'
				| 'Tank'
				| 'Support'
			)[];
			partype: string;
			stats: Record<string, number>;
		}
	>;
};

const syncChampion = createServerFn({ method: 'POST' }).handler(async () => {
	const championResult = await fetch(
		'https://ddragon.leagueoflegends.com/cdn/15.4.1/data/en_US/champion.json',
	);
	const championApiData: ChampionApiData = await championResult.json();
	const championData = Object.values(championApiData.data).map(
		({ key, name, image }) => {
			return {
				id: Number.parseInt(key),
				name,
				image: `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${image.full}`,
			};
		},
	);

	await db.transaction(async (tx) => {
		for (const { id, name, image } of championData) {
			await tx.insert(champion).values({ id, name, image }).onConflictDoUpdate({
				target: champion.id,
				set: {
					name,
					image,
				},
			});
		}
	});
});

const lockChampion = createServerFn({ method: 'POST' })
	.middleware([requireAuth])
	.validator((data: ToggleChampionSchema) => toggleChampionSchema.parse(data))
	.handler(async ({ data, context }) => {
		await db.transaction(async (tx) => {
			const run = await tx.query.run.findFirst({
				columns: { id: true, status: true },
				where: (table, { eq }) => eq(table.code, data.code),
				with: { members: { columns: { userId: true } } },
			});
			if (!run) {
				throw notFound();
			}
			if (!run.members.some(({ userId }) => userId === context.user.id)) {
				console.log('userid', context.user.id, run.members);
				throw new Error('Unauthorized');
			}
			if (run.status !== 'active') {
				throw new Error('Run is not active');
			}

			const champion = await tx.query.reservedChampion.findFirst({
				columns: {},
				where: (table, { eq, and }) =>
					and(eq(table.championId, data.championId), eq(table.runId, run.id)),
				with: {
					champion: { columns: { name: true } },
				},
			});

			if (champion) {
				throw new Error(`${champion.champion.name} is already reserved`);
			}

			try {
				await tx
					.insert(reservedChampionTable)
					.values({ runId: run.id, championId: data.championId });
			} catch (_) {
				throw new Error('Something went wrong');
			}
		});
	});

const unlockChampion = createServerFn({ method: 'POST' })
	.middleware([requireAuth])
	.validator((data: ToggleChampionSchema) => toggleChampionSchema.parse(data))
	.handler(async ({ data, context }) => {
		await db.transaction(async (tx) => {
			const run = await tx.query.run.findFirst({
				columns: { id: true, status: true },
				where: (table, { eq }) => eq(table.code, data.code),
				with: { members: { columns: { userId: true } } },
			});
			if (!run) {
				throw notFound();
			}
			if (!run.members.some(({ userId }) => userId === context.user.id)) {
				console.log('userid', context.user.id, run.members);
				throw new Error('Unauthorized');
			}
			if (run.status !== 'active') {
				throw new Error('Run is not active');
			}

			const reservedChampion = await tx.query.reservedChampion.findFirst({
				columns: { championId: true },
				where: (table, { eq }) => eq(table.championId, data.championId),
			});

			if (!reservedChampion) {
				const champion = await tx.query.champion.findFirst({
					where: (table, { eq }) => eq(table.id, data.championId),
				});

				if (!champion) {
					throw new Error('Champion could not be found');
				}
				throw new Error(`${champion.name} is not currently reserved`);
			}

			try {
				await tx
					.delete(reservedChampionTable)
					.where(
						and(
							eq(reservedChampionTable.runId, run.id),
							eq(reservedChampionTable.championId, data.championId),
						),
					);
			} catch (_) {
				throw new Error('Something went wrong');
			}
		});
	});

export const championMutations = {
	useSync: () => useMutation({ mutationFn: () => syncChampion() }),
	useLock: () => {
		const queryClient = useQueryClient();
		const [name] = useAvailabilitySearch();
		return useMutation({
			mutationFn: (data: ToggleChampionSchema) => lockChampion({ data }),
			onMutate: async (data) => {
				await queryClient.cancelQueries({
					queryKey: championQueries
						.availability({ code: data.code, name })
						.opts().queryKey,
				});

				const previousChampions = queryClient.getQueryData(
					championQueries.availability({ code: data.code, name }).opts()
						.queryKey,
				);

				queryClient.setQueryData(
					championQueries.availability({ code: data.code, name }).opts()
						.queryKey,
					(champions) => {
						if (champions) {
							return champions.map((champion) => {
								if (champion.id === data.championId) {
									return { ...champion, reserved: true };
								}
								return champion;
							});
						}
					},
				);

				return { previousChampions, data };
			},
			onError: ({ message }, data, context) => {
				queryClient.setQueryData(
					championQueries.availability({ code: data.code, name }).opts()
						.queryKey,
					context?.previousChampions,
				);
				toast.error(message);
			},
			onSettled: (_void, _error, data) => {
				queryClient.invalidateQueries({
					queryKey: championQueries
						.availability({ code: data.code, name })
						.opts().queryKey,
				});
				queryClient.invalidateQueries({
					queryKey: championQueries.reserved({ code: data.code }).opts()
						.queryKey,
				});
			},
		});
	},
	useUnlock: () => {
		const queryClient = useQueryClient();
		const [name] = useAvailabilitySearch();

		return useMutation({
			mutationFn: (data: ToggleChampionSchema) => unlockChampion({ data }),
			onMutate: async (data) => {
				await queryClient.cancelQueries({
					queryKey: championQueries.all().key(),
				});

				const previousChampions = queryClient.getQueryData(
					championQueries.availability({ code: data.code, name }).opts()
						.queryKey,
				);

				const previousReserved = queryClient.getQueryData(
					championQueries.reserved({ code: data.code }).opts().queryKey,
				);

				queryClient.setQueryData(
					championQueries.availability({ code: data.code, name }).opts()
						.queryKey,
					(champions) => {
						if (champions) {
							return champions.map((champion) => {
								if (champion.id === data.championId) {
									return { ...champion, reserved: false };
								}
								return champion;
							});
						}
					},
				);

				queryClient.setQueryData(
					championQueries.reserved({ code: data.code }).opts().queryKey,
					(champions) => {
						if (champions) {
							return champions.filter(({ id }) => id !== data.championId);
						}
					},
				);

				return { previousChampions, previousReserved, data };
			},
			onError: ({ message }, data, context) => {
				queryClient.setQueryData(
					championQueries.availability({ code: data.code, name }).opts()
						.queryKey,
					context?.previousChampions,
				);
				queryClient.setQueryData(
					championQueries.reserved({ code: data.code }).opts().queryKey,
					context?.previousReserved,
				);
				toast.error(message);
			},
			onSettled: (_void, _error, data) => {
				queryClient.invalidateQueries({
					queryKey: championQueries
						.availability({ code: data.code, name })
						.opts().queryKey,
				});
				queryClient.invalidateQueries({
					queryKey: championQueries.reserved({ code: data.code }).opts()
						.queryKey,
				});
			},
		});
	},
};
