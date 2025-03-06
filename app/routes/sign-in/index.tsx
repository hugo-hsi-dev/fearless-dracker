import SignInDiscord from "@/features/auth/components/sign-in-discord";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<SignInDiscord />
		</div>
	);
}
