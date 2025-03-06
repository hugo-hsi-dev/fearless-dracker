import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { createServer } from "@tanstack/react-start/server";
import { championTable } from "../schema/tables";

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
				| "Fighter"
				| "Mage"
				| "Assassin"
				| "Marksman"
				| "Tank"
				| "Support"
			)[];
			partype: string;
			stats: Record<string, number>;
		}
	>;
};

const syncChampion = createServerFn({ method: "POST" }).handler(async () => {
	const championResult = await fetch(
		"https://ddragon.leagueoflegends.com/cdn/15.4.1/data/en_US/champion.json",
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
		for (const champion of championData) {
			const { id, name, image } = champion;
			await tx.insert(championTable).values(champion).onConflictDoUpdate({
				target: championTable.id,
				set: {
					name,
					image,
				},
			});
		}
	});
});
