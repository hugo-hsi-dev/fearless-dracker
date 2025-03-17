import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { championQueries } from '@/features/champion/lib/queries';
import useRunCode from '@/hooks/use-run-code';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';

export default function ChampionCountCard() {
	const { code } = useRunCode();
	const reservedChampionsOpts = championQueries.reserved({ code }).useOpts();
	const championAvailabilityOpts = championQueries
		.availability({ code, name: '' })
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
		<Card className="gap-2 h-[160px] justify-between">
			<CardHeader>
				<CardTitle className="text-sm font-medium">Used Champions</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-1">
				<div className="text-4xl font-bold tracking-tighter">
					{reservedChampions.data}
				</div>
				<div className="text-xs text-muted-foreground">
					of {championAvailability.data} champions
				</div>
			</CardContent>
		</Card>
	);
}
