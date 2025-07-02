"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { CreateTask } from "@/lib/tasks"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface AddTaskDialogProps {
    projectId: string,
    onTaskAdded: () => void
}

export function AddTaskDialog({ projectId, onTaskAdded }: AddTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
    const [status, setStatus] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        if (!title.trim()) {
            toast.error("Please enter a title")
            return
        }

        if (!description.trim()) {
            toast.error("Please enter a description")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await CreateTask(projectId, {
                title: title.trim(),
                description: description.trim(),
                dueDate: dueDate ? dueDate.toISOString() : null,
                status: status.trim()
            })

            if (!response) {
                throw new Error("Failed to create task")
            }

            toast.success("Task created successfully")

            setTitle("")
            setDescription("")
            setDueDate(undefined)
            setStatus("")
            setOpen(false)
            onTaskAdded()
        } catch (error) {
            console.error("Error creating task:", error)
            toast.error("Failed to create task")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Create a new task to add to your list.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <Input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            autoFocus
                        />
                        <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                        <div>
                            <label className="block mb-1 text-sm">Fälligkeitsdatum</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={"w-full justify-start text-left font-normal " + (!dueDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "PPP") : <span>Datum wählen</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dueDate}
                                        onSelect={setDueDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Input
                            type="text"
                            placeholder="Status (z.B. offen, in Bearbeitung, erledigt)"
                            value={status}
                            onChange={event => setStatus(event.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Task"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 