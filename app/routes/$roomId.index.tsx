import ChampionCard from "@/components/champion-card";
import { Button } from "@/components/ui/button";
import UnusedChampionList from "@/components/unused-champion-list";
import UsedChampionList from "@/components/used-champion-list";
import {
	championQueries,
	getChampionNames,
	getUnusedChampions,
	getUsedChampions,
} from "@/server/queries";

import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$roomId/")({
	component: LayoutComponent,
	loader: async ({ params: { roomId }, context }) => {
		await context.queryClient.ensureQueryData(
			championQueries.unused({ roomId }),
		);
	},
});

function LayoutComponent() {
	const data = Route.useLoaderData();

	return (
		<div className="grid grid-cols-3 gap-4">
			<div className="col-span-1">
				<UnusedChampionList />
			</div>
			<div className="col-span-2">
				<UsedChampionList />
			</div>
		</div>
	);
}
