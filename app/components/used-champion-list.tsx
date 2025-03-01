import { championQueries } from "@/server/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import UsedChampionCard from "./used-champion-card";

const route = getRouteApi("/$roomId/");

export default function UsedChampionList() {
	const { roomId } = route.useParams();
	const options = championQueries.useUsed({ roomId });
	const { data } = useSuspenseQuery(options);
	return (
		<ul className="flex flex-wrap gap-2">
			{data.map((champion) => (
				<li key={champion.id}>
					<UsedChampionCard {...champion} />
				</li>
			))}
		</ul>
	);
}
