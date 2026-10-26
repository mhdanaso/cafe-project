import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, HTTPException
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


class MenuItem(BaseModel):
    id: int
    name: str
    price: int
    category: str


class OrderItem(BaseModel):
    menu_item_id: int
    quantity: Annotated[int, Field(ge=1, le=20)]


class PickupOrder(BaseModel):
    customer_name: Annotated[str, Field(min_length=2, max_length=100)]
    phone: Annotated[str, Field(min_length=7, max_length=20)]
    pickup_time: Annotated[str, Field(min_length=1, max_length=50)]
    notes: Annotated[str | None, Field(default=None, max_length=500)]
    items: Annotated[list[OrderItem], Field(min_length=1, max_length=30)]


class PickupOrderResponse(BaseModel):
    order_id: int
    total: int
    status: str
    message: str
    submitted_at: datetime


DEFAULT_MENU_ITEMS = (
    (1, "Espresso", 120, "Espresso"),
    (2, "Cappuccino", 160, "Espresso"),
    (3, "Filter Coffee", 90, "Filter"),
    (4, "Cold Brew", 180, "Filter"),
    (5, "Croissant", 110, "Pastries"),
    (6, "Almond Biscotti", 90, "Pastries"),
)


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
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS menu_items (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price INTEGER NOT NULL CHECK (price >= 0),
                category TEXT NOT NULL
            )
            """
        )
        connection.executemany(
            """
            INSERT OR IGNORE INTO menu_items (id, name, price, category)
            VALUES (?, ?, ?, ?)
            """,
            DEFAULT_MENU_ITEMS,
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                pickup_time TEXT NOT NULL,
                notes TEXT,
                total INTEGER NOT NULL,
                status TEXT NOT NULL,
                submitted_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                menu_item_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price INTEGER NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
            )
            """
        )


initialize_database()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/menu", response_model=list[MenuItem])
def get_menu() -> list[MenuItem]:
    with sqlite3.connect(DATABASE_PATH) as connection:
        rows = connection.execute(
            "SELECT id, name, price, category FROM menu_items ORDER BY id"
        ).fetchall()

    return [MenuItem(id=row[0], name=row[1], price=row[2], category=row[3]) for row in rows]


@app.post("/api/orders", response_model=PickupOrderResponse)
def create_order(order: PickupOrder) -> PickupOrderResponse:
    item_ids = [item.menu_item_id for item in order.items]
    if len(item_ids) != len(set(item_ids)):
        raise HTTPException(status_code=400, detail="Each menu item may appear only once.")

    placeholders = ",".join("?" for _ in item_ids)
    with sqlite3.connect(DATABASE_PATH) as connection:
        menu_rows = connection.execute(
            f"SELECT id, price FROM menu_items WHERE id IN ({placeholders})",
            item_ids,
        ).fetchall()
        prices = {row[0]: row[1] for row in menu_rows}

        if len(prices) != len(item_ids):
            raise HTTPException(status_code=400, detail="One or more menu items are unavailable.")

        total = sum(prices[item.menu_item_id] * item.quantity for item in order.items)
        submitted_at = datetime.now(timezone.utc)
        cursor = connection.execute(
            """
            INSERT INTO orders
                (customer_name, phone, pickup_time, notes, total, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order.customer_name,
                order.phone,
                order.pickup_time,
                order.notes,
                total,
                "pending",
                submitted_at.isoformat(),
            ),
        )
        order_id = cursor.lastrowid
        connection.executemany(
            """
            INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
            VALUES (?, ?, ?, ?)
            """,
            [
                (order_id, item.menu_item_id, item.quantity, prices[item.menu_item_id])
                for item in order.items
            ],
        )

    return PickupOrderResponse(
        order_id=order_id,
        total=total,
        status="pending",
        message="Your pickup order was placed successfully.",
        submitted_at=submitted_at,
    )


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