import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { championQueries } from '@/features/champion/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';

export default function ChampionCountCard() {
	const { runCode } = useParams({ from: '/_auth/app/$runCode/' });
	const reservedChampionsOpts = championQueries
		.reserved({ code: runCode })
		.useOpts();
	const championAvailabilityOpts = championQueries
		.availability({ code: runCode, name: '' })
		.useOpts();
	const reservedChampions = useSuspenseQuery({
		...reservedChampionsOpts,
		select: (data) => data.length,
	});
	const championAvailability = useSuspenseQuery({
		...championAvailabilityOpts,
		select: (data) => data.length,
	});
	return (
		<Card className="gap-2">
			<CardHeader>
				<CardTitle className="text-sm font-medium">Used Champions</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold tracking-tighter">
					{reservedChampions.data}
				</div>
				<div className="text-xs text-muted-foreground">
					Out of {championAvailability.data} champions
				</div>
			</CardContent>
		</Card>
	);
}
