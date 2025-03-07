import { Divide } from "lucide-react";
import type { PropsWithChildren } from "react";
import Header from "./header";

export default function Shell({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen">
			<Header />
			{children}
		</div>
	);
}
