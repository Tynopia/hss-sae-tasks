import { auth } from "@/auth"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { GetProjects } from "@/lib/projects"
import { redirect } from "next/navigation"

export default async function Page() {
    const session = await auth()

    if (!session) {
        return redirect("/login")
    }

    const projects = await GetProjects()

    if (projects.length > 0) {
        return redirect(`/project/${projects[0].id}`)
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage>Tasks</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold mb-2">No projects found</h2>
                    <p className="text-muted-foreground mb-4">Create a project to get started.</p>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
