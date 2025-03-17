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
	return (
		<div>
			<ChampionCountCard />

			<StatusSelect />
			<ReservedChampionGrid />
		</div>
	);
}
