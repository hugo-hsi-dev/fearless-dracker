import { championQueries } from "@/server/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import UnusedChampionName from "./unused-champion-name";

const route = getRouteApi("/$roomId/");

export default function UnusedChampionList() {
	const { roomId } = route.useParams();
	const { data: unusedChampions } = useSuspenseQuery(
		championQueries.useUnused({ roomId }),
	);

	return (
		<div>
			<ul>
				{unusedChampions.map((champion) => (
					<li key={champion.id}>
						<UnusedChampionName {...champion} />
					</li>
				))}
			</ul>
		</div>
	);
}
