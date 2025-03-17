import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import RunSidebarGroup from '@/features/run/components/run-sidebar-group';

export function AppSidebar() {
	return (
		<Sidebar variant="inset">
			<SidebarContent>
				<RunSidebarGroup />
			</SidebarContent>
		</Sidebar>
	);
}
