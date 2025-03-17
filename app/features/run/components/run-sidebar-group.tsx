import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { runQueries } from '../lib/queries';
import ActiveSidebarMenu from './active-sidebar-menu';
import ArchivedSidebarMenu from './archived-sidebar-menu';
import CompletedSidebarMenu from './completed-sidebar-menu';

export default function RunSidebarGroup() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Runs</SidebarGroupLabel>
			<SidebarGroupContent>
				<ActiveSidebarMenu />
				<CompletedSidebarMenu />
				<ArchivedSidebarMenu />
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
