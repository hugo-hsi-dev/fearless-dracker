import { useNavigate } from "@tanstack/react-router";
import { Divide } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import CopyRoomIdButton from "./copy-room-id-button";
import ReservedChampionList from "./reserved-champion-list";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ReservedChampionPanel() {
	const [reservedQ, setReservedQ] = useState("");
	const navigate = useNavigate({ from: "/$roomId" });

	useEffect(() => {
		// Set a timeout to update the debounced value after the specified delay
		const timeoutId = setTimeout(() => {
			// setDebouncedValue(value);
			navigate({ search: (prev) => ({ ...prev, reservedQ }) });
		}, 300);

		// Clean up the timeout if the value changes before the delay expires
		return () => {
			clearTimeout(timeoutId);
		};
	}, [reservedQ, navigate]);

	return (
		<div className="p-6">
			<div className="flex gap-2">
				<Input
					value={reservedQ}
					onChange={(e) => setReservedQ(e.target.value)}
					className="mb-6"
				/>
				<CopyRoomIdButton />
			</div>
			<Suspense>
				<ReservedChampionList />
			</Suspense>
		</div>
	);
}
