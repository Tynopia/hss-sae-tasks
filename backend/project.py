from prisma import Prisma
from pydantic import BaseModel


class ExecuteProjectBody(BaseModel):
    name: str

class ProjectHelper:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma

    async def create_project(self, user_id: str, name: str):
        return await self.prisma.project.create(data={
            "name": name,
            "userId": user_id
        })

    async def delete_project(self, user_id: str, project_id: str):
        return await self.prisma.project.delete(where={
            "id": project_id,
            "userId": user_id
        })

    async def get_projects(self, user_id: str):
        return await self.prisma.project.find_many(
            where={
                "userId": user_id
            },
            order={
                "createdAt": "desc"
            }
        )