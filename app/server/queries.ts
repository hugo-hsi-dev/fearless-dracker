import { queryOptions } from "@tanstack/react-query";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { db } from "./db";
import { env } from "./env";
import { usedChampionTable } from "./schema";

type ChampionData = {
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
			image: ChampionImage;
			tags: ChampionTags;
			partype: string;
			stats: Record<string, number>;
		}
	>;
};

type ChampionImage = {
	full: string;
	sprite: string;
	group: string;
	x: number;
	y: number;
	w: number;
	h: number;
};

type ChampionTags = (
	| "Fighter"
	| "Mage"
	| "Assassin"
	| "Marksman"
	| "Tank"
	| "Support"
)[];

export const roomIdSchema = createSelectSchema(usedChampionTable).pick({
	roomId: true,
});

export type RoomIdSchema = z.infer<typeof roomIdSchema>;

// Get Champion Data
async function getChampionData() {
	const championResult = await fetch(
		"https://ddragon.leagueoflegends.com/cdn/15.4.1/data/en_US/champion.json",
	);
	const championData: ChampionData = await championResult.json();
	return Object.values(championData.data).map(({ name, image, key, tags }) => ({
		id: key,
		name,
		image: `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${image.full}`,
		tags,
	}));
}

// Get Champion Names
function championNameDTO(
	championData: Awaited<ReturnType<typeof getChampionData>>,
) {
	return championData.map(({ id, name }) => ({
		id: name,
		name,
	}));
}

export const getChampionNames = createServerFn({
	method: "GET",
}).handler(async () => {
	const championData = await getChampionData();
	return championNameDTO(championData);
});

function unusedChampionDTO({
	id,
	image,
	name,
	tags,
}: Awaited<ReturnType<typeof getChampionData>>[number]) {
	return {
		id,
		name,
	};
}

export type UnusedChampion = ReturnType<typeof unusedChampionDTO>;
export type UsedChampion = Awaited<ReturnType<typeof getChampionData>>[number];

// Get Unused Champions
export const getUnusedChampions = createServerFn({
	method: "GET",
})
	.validator((value: RoomIdSchema) => roomIdSchema.parse(value))
	.handler(async ({ data }) => {
		const championData = await getChampionData();

		const usedChampions = await db.query.usedChampionTable.findMany({
			where: ({ roomId }, { eq }) => eq(roomId, data.roomId),
		});

		const unusedChampions = championData.filter(
			({ id }) => !usedChampions.some(({ championId }) => championId === id),
		);
		return unusedChampions.map(unusedChampionDTO);
	});

// Get Used Champions
export const getUsedChampions = createServerFn({
	method: "GET",
})
	.validator((value: RoomIdSchema) => roomIdSchema.parse(value))
	.handler(async ({ data }) => {
		const championData = await getChampionData();

		const usedChampions = await db.query.usedChampionTable.findMany({
			where: ({ roomId }, { eq }) => eq(roomId, data.roomId),
		});

		return championData.filter(({ id }) =>
			usedChampions.some(({ championId }) => championId === id),
		);
	});

export const championQueries = {
	all: () => ["champions"] as const,
	room: ({ roomId }: RoomIdSchema) =>
		[...championQueries.all(), roomId] as const,

	unused: ({ roomId }: RoomIdSchema) =>
		queryOptions({
			queryKey: [...championQueries.room({ roomId }), "unused"] as const,
			queryFn: () => getUnusedChampions({ data: { roomId } }),
		}),
	useUnused: ({ roomId }: RoomIdSchema) => {
		const serverFn = useServerFn(getUnusedChampions);
		return queryOptions({
			queryKey: [...championQueries.room({ roomId }), "unused"] as const,
			queryFn: () => serverFn({ data: { roomId } }),
		});
	},
	used: ({ roomId }: RoomIdSchema) =>
		queryOptions({
			queryKey: [...championQueries.room({ roomId }), "used"] as const,
			queryFn: () => getUsedChampions({ data: { roomId } }),
		}),
	useUsed: ({ roomId }: RoomIdSchema) => {
		const serverFn = useServerFn(getUsedChampions);
		return queryOptions({
			queryKey: [...championQueries.room({ roomId }), "used"] as const,
			queryFn: () => serverFn({ data: { roomId } }),
		});
	},
};
