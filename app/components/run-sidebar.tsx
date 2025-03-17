import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import AvailabilitySidebarGroup from '@/features/champion/components/availability-sidebar-group';
import MemberSidebarGroup from '@/features/member/components/member-sidebar-group';
import RunSidebarGroup from '@/features/run/components/run-sidebar-group';
import { ScrollArea } from './ui/scroll-area';

export function RunSidebar() {
	return (
		<Sidebar variant="inset" side="right" collapsible="none">
			<ScrollArea className="h-screen">
				<SidebarContent>
					{/* <MemberSidebarGroup /> */}
					<AvailabilitySidebarGroup />
				</SidebarContent>
			</ScrollArea>
		</Sidebar>
	);
}
