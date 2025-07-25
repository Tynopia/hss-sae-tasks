FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend ./
COPY ./site/prisma ./site/prisma

RUN prisma generate --generator=python --schema=./site/prisma/schema-sqlite.prisma

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
