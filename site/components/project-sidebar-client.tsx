"use client"

import { useRouter, usePathname } from "next/navigation"
import { Trash2, Check, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreateProject, DeleteProject } from "@/lib/projects"

interface ProjectSidebarClientProps {
    initialProjects: any[]
}

function ProjectSidebarClient({ initialProjects }: ProjectSidebarClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [projects, setProjects] = useState(initialProjects)
    const [selected, setSelected] = useState<string | null>(null)

    useEffect(() => {
        const match = pathname.match(/\/project\/([^/]+)/)
        if (match) setSelected(match[1])
    }, [pathname])

    const handleSelect = (id: string) => {
        setSelected(id)
        router.push(`/project/${id}`)
    }

    const handleDelete = async (id: string) => {
        await DeleteProject(id)
        setProjects(projects.filter(p => p.id !== id))

        if (selected === id) {
            router.push(`/`)
        }
    }

    return (
        <SidebarGroup className="py-0">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map(project => (
                    <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton
                            variant={selected === project.id ? "default" : undefined}
                            onClick={() => handleSelect(project.id)}
                        >
                            {selected === project.id && <Check className="mr-1" />}
                            <span>{project.name}</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction onClick={() => handleDelete(project.id)}>
                            <Trash2 className="w-4 h-4" />
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function AddProjectDialog() {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const router = useRouter()

    async function handleCreate() {
        setLoading(true)
        setError("")

        const { ok, data } = await CreateProject(name)
        setLoading(false)
        
        if (ok) {
            setOpen(false)
            setName("")
            router.push(`/project/${data.id}`)
        } else {
            setError("Could not create project.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton>
                    <Plus />
                    <span>New Project</span>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Project name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                />
                {error && <div className="text-destructive text-sm mt-2">{error}</div>}
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={loading || !name}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { AddProjectDialog }
export default ProjectSidebarClient 