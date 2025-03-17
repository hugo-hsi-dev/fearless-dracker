import { cn } from '@/lib/utils';

type StatusProps = {
	available: boolean;
};

export default function Status({ available }: StatusProps) {
	return (
		<div
			className={cn(
				'h-2 w-2 rounded-full transition',
				available ? 'bg-green-500' : 'bg-red-500',
			)}
		/>
	);
}
