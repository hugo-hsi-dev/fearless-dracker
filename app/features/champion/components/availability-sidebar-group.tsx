import Status from '@/components/status';
import { Input } from '@/components/ui/input';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { championMutations } from '../lib/mutations';
import { championQueries } from '../lib/queries';

export default function AvailabilitySidebarGroup() {
	const { runCode } = useParams({ from: '/_auth/app/$runCode/' });
	const { availabilitySearch } = useSearch({ from: '/_auth/app/$runCode/' });

	const opts = championQueries
		.availability({ code: runCode, name: availabilitySearch })
		.useOpts();
	const { data } = useSuspenseQuery(opts);
	const lock = championMutations.useLock();
	const unlock = championMutations.useUnlock();

	const navigate = useNavigate({ from: '/app/$runCode' });

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Champions</SidebarGroupLabel>
			<Input
				placeholder="Search champions..."
				value={availabilitySearch}
				onChange={(e) =>
					navigate({ search: { availabilitySearch: e.target.value } })
				}
			/>
			<SidebarGroupContent>
				<SidebarMenu>
					{data.map(({ id, name, reserved }) => (
						<SidebarMenuItem key={id}>
							<SidebarMenuButton
								onClick={() => {
									if (!reserved) {
										return lock.mutate({ code: runCode, championId: id });
									}
									unlock.mutate({ code: runCode, championId: id });
								}}
							>
								<Status available={!reserved} />
								{name}
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
