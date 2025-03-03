import { championMutations } from "@/server/mutations";
import type { ChampionDTO } from "@/server/queries";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export default function AvailableChampionCard(champion: ChampionDTO) {
	const { mutate } = championMutations.useLockChampion();
	return (
		<Button
			variant="ghost"
			className="justify-between w-full"
			onClick={() => mutate(champion)}
		>
			{champion.name}
			<Plus />
		</Button>
	);
}
