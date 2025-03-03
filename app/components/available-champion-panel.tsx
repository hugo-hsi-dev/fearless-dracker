import useDebounce from "@/hooks/use-debounce";
import { useNavigate } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import AvailableChampionList from "./available-champion-list";
import { Input } from "./ui/input";

export default function AvailableChampionPanel() {
	const [availableQ, setAvailableQ] = useState("");
	const navigate = useNavigate({ from: "/$roomId" });
	// const debouncedSearch = useDebounce(search, 300);

	useEffect(() => {
		// Set a timeout to update the debounced value after the specified delay
		const timeoutId = setTimeout(() => {
			// setDebouncedValue(value);
			navigate({ search: (prev) => ({ ...prev, availableQ }) });
		}, 300);

		// Clean up the timeout if the value changes before the delay expires
		return () => {
			clearTimeout(timeoutId);
		};
	}, [availableQ, navigate]);

	return (
		<div className="p-6">
			<Input
				value={availableQ}
				onChange={(e) => setAvailableQ(e.target.value)}
				className="mb-6"
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<AvailableChampionList />
			</Suspense>
		</div>
	);
}
