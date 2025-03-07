import { authQueries, getRequiredAuth } from "@/features/auth/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useSuspenseQuery(authQueries.required().opts());
	return <div>Hello "/_auth/dashboard/"! {data.name}</div>;
}
