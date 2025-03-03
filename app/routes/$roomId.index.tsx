import AvailableChampionList from "@/components/available-champion-list";
import AvailableChampionPanel from "@/components/available-champion-panel";
import ReservedChampionList from "@/components/reserved-champion-list";
import ReservedChampionPanel from "@/components/reserved-champion-panel";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
	availableQuerySchema,
	championQueries,
	reservedQuerySchema,
} from "@/server/queries";

import { Outlet, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/$roomId/")({
	component: LayoutComponent,
	validateSearch: (search) =>
		availableQuerySchema.merge(reservedQuerySchema).parse(search),
	loaderDeps: ({ search }) => search,
	loader: async ({
		params: { roomId },
		context,
		deps: { availableQ, reservedQ },
	}) => {
		await context.queryClient.ensureQueryData(
			championQueries.reserved({ roomId, reservedQ }),
		);
		await context.queryClient.ensureQueryData(
			championQueries.available({ roomId, availableQ }),
		);
	},
});

function LayoutComponent() {
	const data = Route.useLoaderData();

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={15}>
				<AvailableChampionPanel />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={85}>
				<ReservedChampionPanel />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
