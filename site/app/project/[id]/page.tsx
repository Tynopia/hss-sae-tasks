import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { GetProjects } from "@/lib/projects"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { TaskList } from "@/components/task-list"
import { GetTasks } from "@/lib/tasks"
import { redirect } from "next/navigation"

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const projects = await GetProjects()
    const project = projects.find(p => p.id === params.id)

    if (!project) return redirect("/")

    const tasks = await GetTasks(project.id)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{project.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <TaskList projectId={project.id} initialTasks={tasks} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
