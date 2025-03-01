import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
import { db } from "./db";
import { championQueries } from "./queries";
import { usedChampionTable } from "./schema";

const mutateChampionSchema = createUpdateSchema(usedChampionTable)
	.pick({
		championId: true,
		roomId: true,
	})
	.required();

type MutateChampionSchema = z.infer<typeof mutateChampionSchema>;

const useChampion = createServerFn({ method: "POST" })
	.validator((value: MutateChampionSchema) => mutateChampionSchema.parse(value))
	.handler(async ({ data }) => {
		return await db.insert(usedChampionTable).values(data);
	});

const unUseChampion = createServerFn({ method: "POST" })
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

const route = getRouteApi("/$roomId/");

export const championMutations = {
	useUseChampion: () => {
		const queryClient = useQueryClient();
		const { roomId } = route.useParams();
		const unusedChampionsQueryKey = championQueries.unused({ roomId }).queryKey;

		return useMutation({
			mutationFn: (values: MutateChampionSchema) =>
				useChampion({ data: values }),
			onMutate: async (values) => {
				await queryClient.cancelQueries({
					queryKey: championQueries.room({ roomId }),
				});

				const previousUnusedChampions = queryClient.getQueryData(
					unusedChampionsQueryKey,
				);

				queryClient.setQueryData(unusedChampionsQueryKey, (oldData) =>
					(oldData ?? []).filter(
						(champion) => champion.id !== values.championId,
					),
				);
				return { previousUnusedChampions, values };
			},
			onError: (err, value, context) => {
				queryClient.setQueryData(
					unusedChampionsQueryKey,
					context?.previousUnusedChampions,
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: championQueries.room({ roomId }),
				});
			},
		});
	},
	useUnuseChampion: () => {
		const queryClient = useQueryClient();
		const { roomId } = route.useParams();
		const unusedChampionsQueryKey = championQueries.unused({ roomId }).queryKey;

		return useMutation({
			mutationFn: (values: MutateChampionSchema) =>
				unUseChampion({ data: values }),
			onMutate: async (values) => {
				await queryClient.cancelQueries({
					queryKey: championQueries.room({ roomId }),
				});

				const previousUnusedChampions = queryClient.getQueryData(
					unusedChampionsQueryKey,
				);

				queryClient.setQueryData(unusedChampionsQueryKey, (oldData) =>
					(oldData ?? []).filter(
						(champion) => champion.id !== values.championId,
					),
				);

				return { previousUnusedChampions, values };
			},
			onError: (err, value, context) => {
				queryClient.setQueryData(
					unusedChampionsQueryKey,
					context?.previousUnusedChampions,
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: championQueries.room({ roomId }),
				});
			},
		});
	},
};
