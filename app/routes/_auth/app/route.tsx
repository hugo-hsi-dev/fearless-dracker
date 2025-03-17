import { AppSidebar } from '@/components/app-sidebar';
import { RunSidebar } from '@/components/run-sidebar';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/features/auth/lib/auth';
import { runQueries } from '@/features/run/lib/queries';
import { statusConfig } from '@/features/run/schemas/tables';
import {
	Outlet,
	createFileRoute,
	useMatch,
	useMatchRoute,
	useParentMatches,
} from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/app')({
	component: RouteComponent,
	loader: async ({ context }) => {
		const queryDataPromises = statusConfig.map((status) =>
			context.queryClient.ensureQueryData(runQueries.list({ status }).opts()),
		);
		await Promise.all(queryDataPromises);
	},
});

function RouteComponent() {
	const match = useMatch({ from: '/_auth/app/$runCode/', shouldThrow: false });
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="p-6">
				<SidebarTrigger />
				<div className="mt-6">
					<Outlet />
				</div>
			</SidebarInset>
			{match && <RunSidebar />}
		</SidebarProvider>
	);
}
