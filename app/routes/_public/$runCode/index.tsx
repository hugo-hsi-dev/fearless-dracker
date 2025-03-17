import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuickCheckModal from '@/features/champion/components/quick-check-modal';
import ReservedChampionGrid from '@/features/champion/components/reserved-champion-grid';
import { championQueries } from '@/features/champion/lib/queries';
import { memberQueries } from '@/features/member/lib/queries';
import ChampionCountCard from '@/features/run/components/champion-count-card';
import { runQueries } from '@/features/run/lib/queries';
import { availabilitySearchSchema } from '@/hooks/use-availability-search';
import { createFileRoute } from '@tanstack/react-router';
import type { z } from 'zod';

const searchSchema = availabilitySearchSchema;

type searchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_public/$runCode/')({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) =>
		searchSchema.parse(search),
	loaderDeps: ({ search }) => search,
	loader: async ({ context, params, deps }) => {
		await context.queryClient.ensureQueryData(
			runQueries.detail({ code: params.runCode }).opts(),
		);
		await context.queryClient.ensureQueryData(
			memberQueries.list({ code: params.runCode }).opts(),
		);
		await context.queryClient.ensureQueryData(
			championQueries
				.availability({ code: params.runCode, name: deps.availabilitySearch })
				.opts(),
		);
		await context.queryClient.ensureQueryData(
			championQueries.reserved({ code: params.runCode }).opts(),
		);
	},
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-4">
				<div className="flex-1">
					<ChampionCountCard />
				</div>
				<Card className="flex justify-center items-center">
					<CardContent>
						<QuickCheckModal>
							<Button>Quick Check</Button>
						</QuickCheckModal>
					</CardContent>
				</Card>
			</div>
			<ReservedChampionGrid />
		</div>
	);
}
