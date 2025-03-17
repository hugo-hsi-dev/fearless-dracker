import Header from '@/components/header';
import Shell from '@/components/shell';
import { Button } from '@/components/ui/button';
import QuickCheckModal from '@/features/champion/components/quick-check-modal';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Shell>
			<main className="container mx-auto">
				<Outlet />
			</main>
		</Shell>
	);
}
