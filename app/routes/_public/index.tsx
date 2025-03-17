import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import QuickCheckModal from '@/features/champion/components/quick-check-modal';
import { Link, createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';

export const Route = createFileRoute('/_public/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [value, setValue] = useState('');
	return (
		<Card>
			<CardHeader>
				<CardTitle>Join a run</CardTitle>
				<CardDescription>
					Enter the room code to view tracked champions
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<Input
					placeholder="Run code"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button asChild>
					<Link
						to="/$runCode"
						params={{ runCode: value }}
						search={{ availabilitySearch: '' }}
					>
						Join the run
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
