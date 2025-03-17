import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Crown } from 'lucide-react';
import { memberQueries } from '../lib/queries';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export default function MemberSidebarGroup() {
  const { runCode } = useParams({ from: '/_auth/app/$runCode/' });
  const opts = memberQueries.list({ code: runCode }).useOpts();
  const { data } = useSuspenseQuery(opts);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Members</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map(({ id, name, image, role }) => (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton className='h-auto'>
                <Avatar>
                  <AvatarImage src={image ?? undefined} alt={name} />
                  <AvatarFallback>{name[0]}</AvatarFallback>
                </Avatar>
                <span>{name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
