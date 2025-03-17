import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
	Link,
	useMatch,
	useMatchRoute,
	useRouter,
} from '@tanstack/react-router';
import { ChevronRight, Plus, Swords } from 'lucide-react';
import { runQueries } from '../lib/queries';
import CreateRunModal from './create-run-modal';

export default function ActiveSidebarMenu() {
	const query = runQueries.list({ status: 'active' }).useOpts();
	const { data } = useSuspenseQuery(query);
	const matchRoute = useMatchRoute();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton>
					<Swords />
					<span>Active</span>
				</SidebarMenuButton>
				<CreateRunModal asChild>
					<SidebarMenuAction>
						<Plus />
					</SidebarMenuAction>
				</CreateRunModal>
				<SidebarMenuSub>
					{/* <SidebarMenuSubItem>Hello</SidebarMenuSubItem> */}
					{data.map(({ id, name, code }) => (
						<SidebarMenuSubItem key={id}>
							<SidebarMenuSubButton
								isActive={
									!!matchRoute({
										to: '/app/$runCode',
										params: { runCode: code },
									})
								}
								asChild
							>
								<Link to="/app/$runCode" params={{ runCode: code }}>
									{name}
								</Link>
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					))}
				</SidebarMenuSub>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
