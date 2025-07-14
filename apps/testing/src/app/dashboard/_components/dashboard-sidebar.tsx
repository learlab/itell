import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@itell/ui/sidebar";

import { DashboardLinks } from "./nav-statistics";
import { RoleSwitcher } from "./role-switch";

export function DashboardSidebar({ isTeacher }: { isTeacher: boolean }) {
  return (
    <Sidebar>
      <SidebarContent className="gap-2">
        {isTeacher ? (
          <SidebarHeader>
            <RoleSwitcher />
          </SidebarHeader>
        ) : null}
        <SidebarGroup>
          <SidebarGroupLabel>Statistics</SidebarGroupLabel>
          <SidebarGroupContent>
            <DashboardLinks />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarMenu></SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
