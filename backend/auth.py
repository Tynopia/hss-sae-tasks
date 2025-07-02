from typing import Annotated, Any, Optional, Coroutine

from fastapi.params import Depends
from fastapi.security import OAuth2
from fastapi import HTTPException, status, Path
from prisma import Prisma
from prisma.models import User, Task

class AuthHelper:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma

    async def __get_user_from_token(self, authorization: str) -> Optional[User]:
        result = await self.prisma.session.find_unique(
            where={
                "sessionToken": authorization
            },
            include={
                "user": True
            }
        )

        if result is None:
            return None

        return result.user

    async def get_current_user(self, token: Annotated[str, Depends(OAuth2())]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization token"
        )
        user = await self.__get_user_from_token(token)
        if user is None:
            raise credentials_exception
        return user