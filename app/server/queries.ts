import { queryOptions } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
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

export const availableQuerySchema = z.object({
	availableQ: z.string().catch(""),
});

export const reservedQuerySchema = z.object({
	reservedQ: z.string().catch(""),
});

export const availableChampionQuerySchema = createSelectSchema(
	usedChampionTable,
)
	.pick({
		roomId: true,
	})
	.merge(availableQuerySchema);

export const reservedChampionQuerySchema = createSelectSchema(usedChampionTable)
	.pick({
		roomId: true,
	})
	.merge(reservedQuerySchema);

export type AvailableChampionQuerySchema = z.infer<
	typeof availableChampionQuerySchema
>;
export type ReservedChampionQuerySchema = z.infer<
	typeof reservedChampionQuerySchema
>;

// DTOs
function championDTO({ key, image, tags, name }: ChampionData["data"][string]) {
	return {
		id: key,
		image: `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${image.full}`,
		tags,
		name,
	};
}

function championNameDTO({ id, name }: ReturnType<typeof championDTO>) {
	return {
		id,
		name,
	};
}
export type ChampionDTO = ReturnType<typeof championDTO>;

// Server Functions
const getChampionData = createServerFn({ method: "GET" }).handler(async () => {
	// Fetch the data
	const championResult = await fetch(
		"https://ddragon.leagueoflegends.com/cdn/15.4.1/data/en_US/champion.json",
	);
	const championData: ChampionData = await championResult.json();
	const championsArray = Object.values(championData.data);

	// Filter out data
	return championsArray.map((champion) => championDTO(champion));
});

const getReservedChampions = createServerFn({ method: "GET" })
	.validator((values: ReservedChampionQuerySchema) =>
		reservedChampionQuerySchema.parse(values),
	)
	.handler(async ({ data, context }) => {
		const championData = await getChampionData();
		const reservedChampions = await db.query.usedChampionTable.findMany({
			where: (championTable, { eq }) => eq(championTable.roomId, data.roomId),
		});

		return championData.filter((champion) => {
			if (
				champion.name.toLowerCase().includes(data.reservedQ.toLowerCase()) ||
				data.reservedQ.length === 0
			) {
				return reservedChampions.some(
					(reserved) => reserved.championId === champion.id,
				);
			}
			return false;
		});
	});

const getAvailableChampions = createServerFn({ method: "GET" })
	.validator((values: AvailableChampionQuerySchema) =>
		availableChampionQuerySchema.parse(values),
	)
	.handler(async ({ data, context }) => {
		const championData = await getChampionData();
		const reservedChampions = await db.query.usedChampionTable.findMany({
			where: (championTable, { eq }) => eq(championTable.roomId, data.roomId),
		});

		return championData.filter((champion) => {
			if (
				champion.name.toLowerCase().includes(data.availableQ.toLowerCase()) ||
				data.availableQ.length === 0
			) {
				return !reservedChampions.some(
					(reserved) => reserved.championId === champion.id,
				);
			}
			return false;
		});
	});

// Query Factory
export const championQueries = {
	all: () =>
		queryOptions({
			queryKey: ["champions"],
			queryFn: () => getChampionData(),
		}),
	rooms: ({ roomId }: Pick<AvailableChampionQuerySchema, "roomId">) =>
		[...championQueries.all().queryKey, roomId] as const,
	reserved: ({ roomId, reservedQ }: ReservedChampionQuerySchema) =>
		queryOptions({
			queryKey: [
				...championQueries.rooms({ roomId }),
				"reserved",
				reservedQ,
			] as const,
			queryFn: () => getReservedChampions({ data: { roomId, reservedQ } }),
		}),
	useReserved: () => {
		const serverFn = useServerFn(getReservedChampions);
		const { roomId } = useParams({ from: "/$roomId/" });
		const { reservedQ } = useSearch({ from: "/$roomId/" });
		return queryOptions({
			queryKey: [
				...championQueries.reserved({ roomId, reservedQ }).queryKey,
			] as const,
			queryFn: () => serverFn({ data: { roomId, reservedQ } }),
		});
	},
	available: ({ roomId, availableQ }: AvailableChampionQuerySchema) =>
		queryOptions({
			queryKey: [
				...championQueries.rooms({ roomId }),
				"available",
				availableQ,
			] as const,
			queryFn: () => getAvailableChampions({ data: { roomId, availableQ } }),
		}),
	useAvailable: () => {
		const serverFn = useServerFn(getAvailableChampions);
		const { roomId } = useParams({ from: "/$roomId/" });
		const { availableQ } = useSearch({ from: "/$roomId/" });
		return queryOptions({
			queryKey: [
				...championQueries.available({ roomId, availableQ }).queryKey,
			] as const,
			queryFn: () => serverFn({ data: { roomId, availableQ } }),
		});
	},
};

const getRooms = createServerFn({ method: "GET" }).handler(async () => {
	return await db.query.roomTable.findMany();
});

export type Room = Awaited<ReturnType<typeof getRooms>>[number];

export const roomQueries = {
	all: () => ["rooms"] as const,
	lists: () => [...roomQueries.all(), "list"] as const,
	list: () =>
		queryOptions({
			queryKey: [...roomQueries.lists()] as const,
			queryFn: () => getRooms(),
		}),
	useList: () => {
		const serverFn = useServerFn(getRooms);
		return queryOptions({
			queryKey: [...roomQueries.list().queryKey] as const,
			queryFn: () => serverFn(),
		});
	},
};
