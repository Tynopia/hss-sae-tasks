# Zusätzliches Projekt über Datenbank ER Modell, Relationenmodell, Doku, ... (Getrennt)
# zählt wie eine halbe Arbeit

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from typing import Annotated

from fastapi.params import Depends
from prisma import Prisma
from prisma.models import User

from auth import AuthHelper
from project import ProjectHelper, ExecuteProjectBody
from tasks import TasksHelper, ExecuteTaskBody, ExecuteCompleteTaskBody

prisma = Prisma()
auth = AuthHelper(prisma)
tasks = TasksHelper(prisma)
project = ProjectHelper(prisma)

@asynccontextmanager
async def lifespan(_: FastAPI):
    await prisma.connect()
    yield
    await prisma.disconnect()

app = FastAPI(lifespan=lifespan)

@app.get("/projects")
async def get_projects(user: Annotated[User, Depends(auth.get_current_user)]):
    return await project.get_projects(user.id)

@app.post("/projects")
async def create_project(create_body: ExecuteProjectBody, user: Annotated[User, Depends(auth.get_current_user)]):
    if not create_body.name or create_body.name.strip() == "":
        raise HTTPException(status_code=400, detail="Name cannot be empty")

    return await project.create_project(user.id, create_body.name)

@app.delete("/projects/{project_id}")
async def delete_project(project_id: str, user: Annotated[User, Depends(auth.get_current_user)]):
    return await project.delete_project(user.id, project_id)

@app.get("/projects/{project_id}/tasks")
async def get_tasks(project_id: str, _: Annotated[User, Depends(auth.get_current_user)]):
    return await tasks.get_tasks(project_id) # Sicherheit lol

@app.post("/projects/{project_id}/tasks")
async def create_task(project_id: str, create_body: ExecuteTaskBody, user: Annotated[User, Depends(auth.get_current_user)]):
    # if not create_body.content or create_body.content.strip() == "":
    #    raise HTTPException(status_code=400, detail="Content cannot be empty")

    return await tasks.create_task(project_id, user.id, create_body.title, create_body.description, create_body.dueDate, create_body.status)

@app.patch("/projects/{project_id}/tasks/{task_id}")
async def update_task(project_id: str, task_id: str, update_body: ExecuteCompleteTaskBody, user: Annotated[User, Depends(auth.get_current_user)]):
    # if not update_body.content or update_body.content.strip() == "":
    #     raise HTTPException(status_code=400, detail="Content cannot be empty")

    return await tasks.update_task(project_id, user.id, task_id, update_body.title, update_body.description, update_body.dueDate, update_body.status, update_body.completed)

@app.delete("/projects/{project_id}/tasks/{task_id}")
async def delete_task(project_id: str, task_id: str, user: Annotated[User, Depends(auth.get_current_user)]):
    return await tasks.delete_task(project_id, user.id, task_id)