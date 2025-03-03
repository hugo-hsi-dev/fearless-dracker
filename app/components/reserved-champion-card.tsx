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
			className="group relative cursor-pointer"
		>
			<div className="transition absolute left-0 top-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 flex justify-center items-center bg-background/80 font-semibold">
				{champion.name}
			</div>
			<img src={champion.image} alt="Reserved Champion" />
		</button>
	);
}
