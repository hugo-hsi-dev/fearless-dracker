import Header from "@/components/header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Header>
			<div>Hello "/_public"!</div>
		</Header>
	);
}
