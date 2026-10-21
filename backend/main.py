import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="Rivera Coffee API",
    description="Backend API for the Rivera Coffee website",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_PATH = Path(__file__).with_name("cafe.db")


class ContactMessage(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=100)]
    email: Annotated[str, Field(min_length=5, max_length=254)]
    message: Annotated[str, Field(min_length=10, max_length=2000)]


class ContactMessageResponse(BaseModel):
    message: str
    submitted_at: datetime


def initialize_database() -> None:
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                submitted_at TEXT NOT NULL
            )
            """
        )


initialize_database()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/contact", response_model=ContactMessageResponse)
def create_contact_message(contact_message: ContactMessage) -> ContactMessageResponse:
    submitted_at = datetime.now(timezone.utc)

    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            INSERT INTO contact_messages (name, email, message, submitted_at)
            VALUES (?, ?, ?, ?)
            """,
            (
                contact_message.name,
                contact_message.email,
                contact_message.message,
                submitted_at.isoformat(),
            ),
        )

    return ContactMessageResponse(
        message="Your message was received successfully.",
        submitted_at=submitted_at,
    )