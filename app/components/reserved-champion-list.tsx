import { championQueries } from "@/server/queries";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	useParams,
	useRouter,
	useRouterState,
	useSearch,
} from "@tanstack/react-router";
import { Divide } from "lucide-react";
import { useState } from "react";
import ReservedChampionCard from "./reserved-champion-card";

export default function ReservedChampionList() {
	const queryOptions = championQueries.useReserved();
	const { data: champions } = useSuspenseQuery(queryOptions);

  const [parent] = useAutoAnimate();

	return (
		<ul className="flex flex-wrap gap-2" ref={parent}>
			{champions.map((champion) => (
				<li key={champion.id}>
					<ReservedChampionCard {...champion} />
				</li>
			))}
		</ul>
	);
}
