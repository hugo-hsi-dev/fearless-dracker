import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/features/auth/lib/auth';
import { authQueries, getRequiredAuth } from '@/features/auth/lib/queries';
import { runMutations } from '@/features/run/lib/mutations';

import { runQueries } from '@/features/run/lib/queries';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/app/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutate } = runMutations.useCreate();
	const [input, setInput] = useState('');
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Create a new run</CardTitle>
					<CardDescription>
						Create a run to track and share used champions
					</CardDescription>
				</CardHeader>
				<CardContent className="flex gap-4">
					<Input
						placeholder="Enter a run name"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button onClick={() => mutate({ name: input })}>Create a room</Button>
				</CardContent>
			</Card>
		</>
	);
}
