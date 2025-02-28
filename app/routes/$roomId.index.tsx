import ChampionCard from "@/components/champion-card";
import { Button } from "@/components/ui/button";
import { getChampionData } from "@/server/queries";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$roomId/")({
	component: LayoutComponent,
	loader: () => getChampionData(),
});

function LayoutComponent() {
	const data = Route.useLoaderData();
	console.log(data);
	return (
		<div className="container mx-auto">
			<div className="flex flex-wrap gap-2">
				{data.map((championData) => (
					<ChampionCard {...championData} key={championData.id} />
				))}
			</div>
		</div>
	);
}
