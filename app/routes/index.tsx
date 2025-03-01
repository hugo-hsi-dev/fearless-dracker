import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const [roomId, setRoomId] = useState("");
	return (
		<div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
			<div className="text-6xl font-bold">Join a room</div>
			<div className="flex gap-2">
				<Input
					className="w-[300px]"
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
				/>
				<Button asChild>
					<Link to="/$roomId" params={{ roomId }}>
						Join
					</Link>
				</Button>
			</div>
		</div>
	);
}
