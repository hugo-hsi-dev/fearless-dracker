import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { runMutations } from '../lib/mutations';
import { runQueries } from '../lib/queries';
import { getRunListSchema } from '../schemas/schemas';
import { statusConfig } from '../schemas/tables';

export default function StatusSelect() {
	const { runCode } = useParams({ from: '/_auth/app/$runCode/' });
	const opts = runQueries.detail({ code: runCode }).useOpts();
	const { data } = useSuspenseQuery(opts);

	const { mutate } = runMutations.useUpdateStatus();

	return (
		<Select
			value={data.status}
			onValueChange={(value: (typeof statusConfig)[number]) =>
				mutate({ code: runCode, status: value })
			}
		>
			<SelectTrigger className="w-[160px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{statusConfig.map((status) => (
						<SelectItem value={status} key={status}>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
