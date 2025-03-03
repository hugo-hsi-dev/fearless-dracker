import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set a timeout to update the debounced value after the specified delay
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timeout if the value changes before the delay expires
		return () => {
			clearTimeout(timeoutId);
		};
	}, [value, delay]);

	return debouncedValue;
}
