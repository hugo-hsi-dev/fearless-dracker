import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { ChevronRight, CircleCheckBig, Swords } from 'lucide-react';
import { runQueries } from '../lib/queries';

export default function CompletedSidebarMenu() {
	const opts = runQueries.list({ status: 'completed' }).useOpts();
	const { data } = useSuspenseQuery(opts);
	const matchRoute = useMatchRoute();
	return (
		<SidebarMenu>
			<Collapsible className="group/collapsible">
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton>
							<CircleCheckBig />
							<span>Completed</span>
							<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
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
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	);
}
