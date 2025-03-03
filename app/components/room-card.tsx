import type { Room } from "@/server/queries";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function RoomCard({ id, createdAt, updatedAt }: Room) {
	return (
		<div className="border rounded-lg p-6">
			<h2>{id}</h2>
			<p>Room Created: {createdAt?.toLocaleDateString("en-US")}</p>
			<p>Last Used: {updatedAt?.toLocaleDateString("en-US")}</p>
			<Button className="mt-4" asChild>
				<Link
					to="/$roomId"
					params={{ roomId: id }}
					search={{ availableQ: "", reservedQ: "" }}
				>
					Join
				</Link>
			</Button>
		</div>
	);
}
