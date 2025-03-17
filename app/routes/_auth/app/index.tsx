import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/features/auth/lib/auth';
import { authQueries, getRequiredAuth } from '@/features/auth/lib/queries';
import MemberList from '@/features/member/components/member-list';
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
			<div>Hello</div>
			<Input value={input} onChange={(e) => setInput(e.target.value)} />
			<Button onClick={() => mutate({ name: input })}>Create a room</Button>
		</>
	);
}
