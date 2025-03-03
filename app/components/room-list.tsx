import { roomQueries } from "@/server/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import RoomCard from "./room-card";

export default function RoomList() {
	const queryOptions = roomQueries.useList();
	const { data } = useSuspenseQuery(queryOptions);
	return (
		<ul className="flex flex-col gap-2">
			{data.map((room) => {
				return (
					<li key={room.id}>
						<RoomCard {...room} />
					</li>
				);
			})}
		</ul>
	);
}
