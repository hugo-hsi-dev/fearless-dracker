import { championMutations } from "@/server/mutations";
import type { UnusedChampion } from "@/server/queries";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "./ui/button";

const route = getRouteApi("/$roomId/");

export default function UnusedChampionName({ name, id }: UnusedChampion) {
	const { roomId } = route.useParams();
	const { mutate } = championMutations.useUseChampion();
	return (
		<div className="flex gap-2">
			{name}
			<Button onClick={() => mutate({ championId: id, roomId, name })}>
				Use
			</Button>
		</div>
	);
}
