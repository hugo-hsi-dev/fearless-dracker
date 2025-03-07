import { authQueries } from "@/features/auth/lib/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_no-auth")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(authQueries.no().opts());
	},
});
