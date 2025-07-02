import datetime
from typing import Optional

from prisma import Prisma
from pydantic import BaseModel

class ExecuteTaskBody(BaseModel):
    title: str
    description: str
    dueDate: Optional[datetime.datetime]
    status: str

class ExecuteCompleteTaskBody(BaseModel):
    title: str
    description: str
    dueDate: Optional[datetime.datetime]
    status: str
    completed: bool

class TasksHelper:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma

    async def create_task(self, project_id: str, user_id: str, title: str, description: str, dueDate: Optional[datetime.datetime], status: str):
        return await self.prisma.task.create(data={
            "title": title,
            "description": description,
            "dueDate": dueDate,
            "status": status,
            "projectId": project_id,
            "userId": user_id
        })

    async def update_task(self, project_id: str, user_id: str, task_id: str, title: str, description: str, dueDate: Optional[datetime.datetime], status: str, completed: bool):
        return await self.prisma.task.update(
            where={
                "id": task_id,
                "projectId": project_id,
                "userId": user_id
            },
            data={
                "title": title,
                "description": description,
                "dueDate": dueDate,
                "status": status,
                "completed": completed
            }
        )

    async def delete_task(self, project_id: str, user_id: str, task_id: str):
        return await self.prisma.task.delete(where={
            "id": task_id,
            "projectId": project_id,
            "userId": user_id
        })

    async def get_tasks(self, project_id: str):
        return await self.prisma.task.find_many(
            where={
                "projectId": project_id
            },
            order={
                "createdAt": "desc"
            }
        )