import { Button } from '@/components/ui/button';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { championMutations } from '../lib/mutations';
import { championQueries } from '../lib/queries';

export default function ReservedChampionGrid() {
	const { runCode } = useParams({ from: '/_auth/app/$runCode/' });
	const opts = championQueries.reserved({ code: runCode }).useOpts();
	const { data } = useSuspenseQuery(opts);
	const [parent] = useAutoAnimate();
	const { mutate } = championMutations.useUnlock();
	return (
		<div className="flex flex-wrap gap-2" ref={parent}>
			{data.map(({ id, name, image }) => (
				<div key={id} className="relative group">
					<img src={image} alt={name} />
					<div className="transition absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/80 flex justify-center items-center">
						<Button
							variant="destructive"
							className="bg-transparent cursor-pointer"
							onClick={() => mutate({ code: runCode, championId: id })}
						>
							Remove
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
