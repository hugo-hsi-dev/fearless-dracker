import RoomList from "@/components/room-list";
import { Button } from "@/components/ui/button";
import { roomMutations } from "@/server/mutations";
import { roomQueries } from "@/server/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(roomQueries.list());
	},
});

function RouteComponent() {
	const { mutate } = roomMutations.useCreateRoom();

	return (
		<div className="p-6 flex flex-col gap-6">
			<Button onClick={() => mutate()}>New Room</Button>
			<RoomList />
		</div>
	);
}
