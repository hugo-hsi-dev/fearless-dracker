import { championMutations } from "@/server/mutations";
import type { UsedChampion } from "@/server/queries";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/$roomId/");

export default function UsedChampionCard({
	id,
	image,
	name,
	tags,
}: UsedChampion) {
	const { roomId } = route.useParams();
	const { mutate } = championMutations.useUnuseChampion();
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div onClick={() => mutate({ championId: id, roomId })}>
			<img src={image} alt={name} />
		</div>
	);
}
