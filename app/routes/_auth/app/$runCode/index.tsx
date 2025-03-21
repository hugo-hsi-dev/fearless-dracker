import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import QuickCheckModal from '@/features/champion/components/quick-check-modal';
import ReservedChampionGrid from '@/features/champion/components/reserved-champion-grid';
import { championQueries } from '@/features/champion/lib/queries';
import { champion } from '@/features/champion/schemas/tables';
import MemberList from '@/features/member/components/member-sidebar-group';
import { memberQueries } from '@/features/member/lib/queries';
import ChampionCountCard from '@/features/run/components/champion-count-card';
import StatusSelect from '@/features/run/components/status-select';
import { runQueries } from '@/features/run/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { createSelectSchema } from 'drizzle-zod';
import { toast } from 'sonner';
import { z } from 'zod';

const searchSchema = z.object({
	availabilitySearch: z.string().catch(''),
});

export const Route = createFileRoute('/_auth/app/$runCode/')({
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
	const { runCode } = Route.useParams();
	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-4">
				<div className="flex-1">
					<ChampionCountCard />
				</div>
				<Card className="justify-between">
					<CardHeader>
						<CardTitle>Run Code</CardTitle>
						<CardDescription>{runCode}</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="ghost"
							onClick={() => {
								navigator.clipboard.writeText(runCode);
								toast(`${runCode} copied!`);
							}}
						>
							Copy Room Code
						</Button>
					</CardContent>
				</Card>
				<div className="flex flex-col gap-4">
					<Card className="flex justify-center items-center flex-1">
						<QuickCheckModal>
							<Button>Quick Check</Button>
						</QuickCheckModal>
					</Card>
					<StatusSelect />
				</div>
			</div>
			<ReservedChampionGrid />
		</div>
	);
}
