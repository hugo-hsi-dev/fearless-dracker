import { Button } from '@/components/ui/button';
import QuickCheckModal from '@/features/champion/components/quick-check-modal';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>home</div>;
}
