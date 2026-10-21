from datetime import datetime, timezone
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


class ContactMessage(BaseModel):
    name: Annotated[str, Field(min_length=2, max_length=100)]
    email: Annotated[str, Field(min_length=5, max_length=254)]
    message: Annotated[str, Field(min_length=10, max_length=2000)]


class ContactMessageResponse(BaseModel):
    message: str
    submitted_at: datetime


messages: list[ContactMessage] = []


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/contact", response_model=ContactMessageResponse)
def create_contact_message(contact_message: ContactMessage) -> ContactMessageResponse:
    messages.append(contact_message)

    return ContactMessageResponse(
        message="Your message was received successfully.",
        submitted_at=datetime.now(timezone.utc),
    )