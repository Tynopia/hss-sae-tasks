"use server";

import { auth } from "@/auth"
import { Task } from "@prisma/client"

const API_URL = process.env.API_URL

export async function GetTasks(projectId: string) {
    const session = await auth()

    const url = new URL(`/projects/${projectId}/tasks`, API_URL)
    if (projectId) {
        url.searchParams.set("projectId", projectId)
    }

    return fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": session.sessionToken
        }
    }).then(res => res.json() as Promise<Task[]>)
}

export async function CreateTask(projectId: string, data: { title: string, description: string, dueDate?: string | null, status: string }) {
    const session = await auth()

    const url = new URL(`/projects/${projectId}/tasks`, API_URL)

    return (await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session.sessionToken
        },
        body: JSON.stringify(data)
    })).ok
}

export async function UpdateTask(projectId: string, taskId: string, update: Partial<Task>): Promise<{
    ok: boolean,
    data: Task
}> {
    const session = await auth()

    const url = new URL(`/projects/${projectId}/tasks/${taskId}`, API_URL)

    console.log(update)

    const result = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session.sessionToken
        },
        body: JSON.stringify(update)
    })

    return {
        ok: result.ok,
        data: await result.json()
    }
}

export async function DeleteTask(projectId: string, taskId: string) {
    const session = await auth()

    const url = new URL(`/projects/${projectId}/tasks/${taskId}`, API_URL)

    return (await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": session.sessionToken
        }
    })).ok
}