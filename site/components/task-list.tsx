"use client"

import { DeleteTask, GetTasks, UpdateTask } from "@/lib/tasks"
import { useSearchParams } from "next/navigation"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { DateRange } from "react-day-picker"
import { TaskCard } from "@/components/task-card"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Task } from "@prisma/client"
import { Plus } from "lucide-react"

import React from "react"

interface TaskListProps {
    projectId: string,
    initialTasks: Task[],
    dateRange?: DateRange | undefined
}

function parseDateLocal(str?: string): Date | undefined {
    if (!str) return undefined;
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
}

export function TaskList({ projectId, initialTasks }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [, setIsUpdating] = useState<string | null>(null)
    const [, setIsDeleting] = useState<string | null>(null)
    const searchParams = useSearchParams()

    const from = parseDateLocal(searchParams.get("from") || undefined)
    const to = parseDateLocal(searchParams.get("to") || undefined)

    async function handleUpdateTask(id: string, update: Partial<Task>) {
        setIsUpdating(id)

        try {
            const { ok, data } = await UpdateTask(projectId, id, update)

            if (!ok) {
                throw new Error("Failed to update task")
            }

            setTasks(prev => prev.map(task =>
                task.id === id ? data : task
            ))

            toast.success("Task updated successfully")
        } catch (error) {
            console.error("Error updating task:", error)
            toast.error("Failed to update task")
            throw error
        } finally {
            setIsUpdating(null)
        }
    }

    async function handleDeleteTask(id: string) {
        setIsDeleting(id)

        try {
            const response = await DeleteTask(projectId, id)

            if (!response) {
                throw new Error("Failed to delete task")
            }

            setTasks(prev => prev.filter(task => task.id !== id))
            toast.success("Task deleted successfully")
        } catch (error) {
            console.error("Error deleting task:", error)
            toast.error("Failed to delete task")
            throw error
        } finally {
            setIsDeleting(null)
        }
    }

    async function handleTaskAdded() {
        try {
            const response = await GetTasks(projectId)
            setTasks(response)
        } catch (error) {
            console.error("Error refreshing tasks:", error)
        }
    }

    const filteredTasks = useMemo(function () {
        if (!from || !to) return tasks

        return tasks.filter(task => {
            if (!task.dueDate) return false
            const due = new Date(task.dueDate)
            return due >= from && due <= to
        })
    }, [tasks, from, to])

    if (filteredTasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">
                    Create your first task to get started
                </p>
                <AddTaskDialog projectId={projectId} onTaskAdded={handleTaskAdded} />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tasks ({filteredTasks.length})</h2>
                <AddTaskDialog projectId={projectId} onTaskAdded={handleTaskAdded} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </div>
        </div>
    )
} 