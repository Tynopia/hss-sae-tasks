import * as React from "react"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { auth } from "@/auth"
import { GetProjects } from "@/lib/projects"
import ProjectSidebarClient, { AddProjectDialog } from "@/components/project-sidebar-client"
import SidebarCalendar from "@/components/sidebar-calendar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> { }

export async function AppSidebar(props: AppSidebarProps) {
    const session = await auth()
    const projects = await GetProjects()

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-sidebar-border h-16 border-b">
                <NavUser user={session?.user!} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarCalendar />
                <SidebarSeparator className="mx-0" />
                <ProjectSidebarClient initialProjects={projects} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <AddProjectDialog />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
