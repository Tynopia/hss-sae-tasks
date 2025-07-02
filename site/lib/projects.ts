"use server";

import { auth } from "@/auth";
import { Project } from "@prisma/client";

const API_URL = process.env.API_URL;

export async function GetProjects() {
    const session = await auth();

    const url = new URL("/projects", API_URL);

    return fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": session!.sessionToken
        }
    }).then(res => res.json() as Promise<Project[]>);
}

export async function CreateProject(name: string) {
    const session = await auth();

    const url = new URL("/projects", API_URL);

    const result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session!.sessionToken
        },
        body: JSON.stringify({ name })
    })

    return {
        ok: result.ok,
        data: await result.json() as Project
    }
}

export async function DeleteProject(id: string) {
    const session = await auth();

    const url = new URL(`/projects/${id}`, API_URL);

    return (await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session!.sessionToken
        }
    })).ok;
} 