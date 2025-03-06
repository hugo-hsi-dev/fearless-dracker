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
			<Button asChild>
				<Link to="/sign-in">Sign In</Link>
			</Button>
		</div>
	);
}
