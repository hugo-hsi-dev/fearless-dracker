import { championMutations } from "@/server/mutations";
import type { ChampionDTO } from "@/server/queries";

export default function ReservedChampionCard(champion: ChampionDTO) {
	const { mutate } = championMutations.useUnlockChampion();
	return (
		<button
			type="button"
			onClick={() => {
				mutate(champion);
			}}
		>
			<img src={champion.image} alt="Reserved Champion" />
		</button>
	);
}
