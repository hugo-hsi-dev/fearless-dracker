import type { ChampionDTO } from "@/server/queries";

type Props = ChampionDTO[number];

export default function ChampionCard({ id, name, image }: Props) {
	return (
		<div className="">
			<img src={image} alt={name} />
		</div>
	);
}
