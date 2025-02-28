import { createServerFn } from "@tanstack/react-start";

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

function championDTO(data: ChampionData) {
	return Object.entries(data.data).map(([_, { key, name, image, tags }]) => ({
		id: key,
		name,
		image: `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${image.full}`,
		tags,
	}));
}

export type ChampionDTO = ReturnType<typeof championDTO>;

export const getChampionData = createServerFn({ method: "GET" }).handler(
	async () => {
		const championResult = await fetch(
			"https://ddragon.leagueoflegends.com/cdn/15.4.1/data/en_US/champion.json",
		);
		const championData: ChampionData = await championResult.json();
		return championDTO(championData);
	},
);
