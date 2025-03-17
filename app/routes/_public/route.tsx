import Header from "@/components/header";
import Shell from "@/components/shell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Shell>
			<div>Hello "/_public"!</div>
		</Shell>
	);
}
