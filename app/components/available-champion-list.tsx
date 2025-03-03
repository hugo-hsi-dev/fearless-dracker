import useDebounce from "@/hooks/use-debounce";
import { championQueries } from "@/server/queries";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import AvailableChampionCard from "./available-champion-card";
import { Input } from "./ui/input";

export default function AvailableChampionList() {
	const { roomId } = useParams({ from: "/$roomId/" });
	const championQuery = championQueries.useAvailable();
	const { data: champions } = useSuspenseQuery(championQuery);

	const [parent, enableAnimations] = useAutoAnimate();

	return (
		<ul className="flex flex-col gap-2" ref={parent}>
			{champions.map((champion) => (
				<li key={champion.id}>
					<AvailableChampionCard {...champion} />
				</li>
			))}
		</ul>
	);
}
