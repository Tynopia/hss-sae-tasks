"use client"

import { useState } from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Task } from "@prisma/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Clock,
    Save,
    X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"

interface TaskCardProps {
    task: Task
    onUpdate: (id: string, update: Partial<Task>) => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDescription, setEditDescription] = useState(task.description)
    const [editDueDate, setEditDueDate] = useState<Date | undefined>(task.dueDate ? new Date(task.dueDate) : undefined)
    const [editStatus, setEditStatus] = useState(task.status)
    const [isUpdating, setIsUpdating] = useState(false)

    async function handleSave() {
        if (editTitle.trim() === "" || editDescription.trim() === "") return

        setIsUpdating(true)

        try {
            await onUpdate(task.id, {
                title: editTitle.trim(),
                description: editDescription.trim(),
                dueDate: editDueDate,
                status: editStatus.trim(),
                completed: task.completed
            })
            setIsEditing(false)
        } catch (error) {
            console.error("Failed to update task:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    function handleCancel() {
        setEditTitle(task.title)
        setEditDescription(task.description)
        setEditDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setEditStatus(task.status)
        setIsEditing(false)
    }

    async function handleDelete() {
        try {
            await onDelete(task.id)
        } catch (error) {
            console.error("Failed to delete task:", error)
        }
    }

    async function handleToggleCompleted() {
        try {
            await onUpdate(task.id, { ...task, completed: !task.completed })
        } catch (error) {
            console.error("Failed to toggle completed:", error)
        }
    }

    return (
        <Card className={`group hover:shadow-md transition-all duration-200 border-l-4 ${task.completed ? 'border-green-500 bg-green-50' : ''}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    placeholder="Title"
                                    className="w-full"
                                    autoFocus
                                />
                                <Textarea
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                    className="min-h-[60px] resize-none"
                                />
                                <div>
                                    <label className="block mb-1 text-sm">Fälligkeitsdatum</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={"w-full justify-start text-left font-normal " + (!editDueDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {editDueDate ? format(editDueDate, "PPP") : <span>Datum wählen</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={editDueDate}
                                                onSelect={setEditDueDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <Input
                                    type="text"
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value)}
                                    placeholder="Status"
                                    className="w-full"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="flex items-center gap-1"
                                    >
                                        <Save className="h-3 w-3" />
                                        {isUpdating ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isUpdating}
                                        className="flex items-center gap-1"
                                    >
                                        <X className="h-3 w-3" />
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={task.completed} onChange={handleToggleCompleted} />
                                    <span className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
                                </div>
                                <p className={`text-sm leading-relaxed ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>{task.description}</p>
                                <div className="flex gap-2 text-xs mt-1">
                                    {task.dueDate && <span>Fällig: {format(new Date(task.dueDate), "dd.MM.yyyy")}</span>}
                                    <span>Status: {task.status}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {!isEditing && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this task? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/80">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <span>Created: {format(new Date(task.createdAt), "MMM dd, yyyy", { locale: de })}</span>
                    </div>
                    {task.updatedAt !== task.createdAt && (
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated: {format(new Date(task.updatedAt), "MMM dd, yyyy", { locale: de })}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
} 