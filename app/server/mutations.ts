import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRouteApi,
	redirect,
	useParams,
	useSearch,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
import { db } from "./db";
import { type ChampionDTO, championQueries } from "./queries";
import { roomTable, usedChampionTable } from "./schema";

const mutateChampionSchema = createUpdateSchema(usedChampionTable)
	.pick({
		championId: true,
		roomId: true,
	})
	.required();

type MutateChampionSchema = z.infer<typeof mutateChampionSchema>;

const lockChampion = createServerFn({ method: "POST" })
	.validator((value: MutateChampionSchema) => mutateChampionSchema.parse(value))
	.handler(async ({ data }) => {
		return await db.insert(usedChampionTable).values(data);
	});

const unlockChampion = createServerFn({ method: "POST" })
	.validator((value: MutateChampionSchema) => mutateChampionSchema.parse(value))
	.handler(async ({ data }) => {
		await db
			.delete(usedChampionTable)
			.where(
				and(
					eq(usedChampionTable.roomId, data.roomId),
					eq(usedChampionTable.championId, data.championId),
				),
			);
	});

export const championMutations = {
	useLockChampion: () => {
		const queryClient = useQueryClient();
		const { roomId } = useParams({ from: "/$roomId/" });
		const { availableQ, reservedQ } = useSearch({ from: "/$roomId/" });

		// Get query keys
		const availableQueryKey = championQueries.available({
			roomId,
			availableQ,
		}).queryKey;
		const reservedQueryKey = championQueries.reserved({
			roomId,
			reservedQ,
		}).queryKey;

		return useMutation({
			mutationFn: ({ id }: ChampionDTO) =>
				lockChampion({ data: { championId: id, roomId } }),
			onMutate: async (values) => {
				await queryClient.cancelQueries({
					queryKey: championQueries.rooms({ roomId }),
				});

				// get previous values
				const previousAvailableChampions =
					queryClient.getQueryData(availableQueryKey);
				const previousReservedChampions =
					queryClient.getQueryData(reservedQueryKey);

				// set optimistic updates
				queryClient.setQueryData(availableQueryKey, (oldData) =>
					(oldData ?? []).filter((champion) => champion.id !== values.id),
				);
				queryClient.setQueryData(reservedQueryKey, (oldData) =>
					[...(oldData ?? []), values].sort((a, b) =>
						a.name.localeCompare(b.name),
					),
				);

				return {
					previousAvailableChampions,
					previousReservedChampions,
					values,
				};
			},
			onError: (err, value, context) => {
				queryClient.setQueryData(
					availableQueryKey,
					context?.previousAvailableChampions,
				);
				queryClient.setQueryData(
					reservedQueryKey,
					context?.previousReservedChampions,
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: championQueries.rooms({ roomId }),
				});
			},
		});
	},
	useUnlockChampion: () => {
		const queryClient = useQueryClient();
		const { roomId } = useParams({ from: "/$roomId/" });
		const { availableQ, reservedQ } = useSearch({ from: "/$roomId/" });
		const availableQueryKey = championQueries.available({
			roomId,
			availableQ,
		}).queryKey;
		const reservedQueryKey = championQueries.reserved({
			roomId,
			reservedQ,
		}).queryKey;

		return useMutation({
			mutationFn: ({ id }: ChampionDTO) =>
				unlockChampion({ data: { championId: id, roomId } }),
			onMutate: async (values) => {
				await queryClient.cancelQueries({
					queryKey: championQueries.rooms({ roomId }),
				});

				const previousAvailableChampions =
					queryClient.getQueryData(availableQueryKey);
				const previousReservedChampions =
					queryClient.getQueryData(reservedQueryKey);

				queryClient.setQueryData(availableQueryKey, (oldData) =>
					[...(oldData ?? []), values].sort((a, b) =>
						a.name.localeCompare(b.name),
					),
				);

				queryClient.setQueryData(reservedQueryKey, (oldData) =>
					(oldData ?? []).filter((champion) => champion.id !== values.id),
				);

				return {
					previousAvailableChampions,
					previousReservedChampions,
					values,
				};
			},
			onError: (err, value, context) => {
				queryClient.setQueryData(
					availableQueryKey,
					context?.previousAvailableChampions,
				);
				queryClient.setQueryData(
					reservedQueryKey,
					context?.previousReservedChampions,
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: championQueries.rooms({ roomId }),
				});
			},
		});
	},
};

const createRoom = createServerFn({ method: "POST" }).handler(async () => {
	const [{ roomId }] = await db
		.insert(roomTable)
		.values({})
		.returning({ roomId: roomTable.id });
	throw redirect({
		to: "/$roomId",
		params: { roomId },
		search: { availableQ: "", reservedQ: "" },
	});
});

export const roomMutations = {
	useCreateRoom: () => {
		return useMutation({ mutationFn: () => createRoom() });
	},
};
