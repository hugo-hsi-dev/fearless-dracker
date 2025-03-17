import Status from '@/components/status';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import useAvailabilitySearch from '@/hooks/use-availability-search';
import useRunCode from '@/hooks/use-run-code';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { championQueries } from '../lib/queries';

type QuickCheckModalProps = {
	children: React.ReactNode;
	asChild?: boolean;
};

export default function QuickCheckModal({
	children,
	asChild,
}: QuickCheckModalProps) {
	const [name, setName] = useAvailabilitySearch();
	const { code } = useRunCode();
	const opts = championQueries.availability({ code, name }).useOpts();
	const { data } = useSuspenseQuery({
		...opts,
		select: (data) =>
			data.map(({ id, reserved, name }) => ({ id, reserved, name })),
	});
	const [parent] = useAutoAnimate();
	return (
		<Dialog>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Search for a champion's status</DialogTitle>
					<DialogDescription className="flex gap-6">
						<div className="flex items-center gap-2">
							<Status available={true} />
							<span>Available</span>
						</div>
						<div className="flex items-center gap-2">
							<Status available={false} />
							<span>Unavailable</span>
						</div>
					</DialogDescription>
				</DialogHeader>
				<Input
					placeholder="Champion name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<ScrollArea className="h-[280px]">
					<div className="flex flex-col gap-2" ref={parent}>
						{data.map(({ id, reserved, name }) => (
							<div key={id} className="flex gap-2 items-center">
								<Status available={!reserved} />
								<span>{name}</span>
							</div>
						))}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
