"""Seed the database with the same demo data the frontend used offline.

Properties are read straight out of frontend/src/utils/mockData.js (parsed
with a small regex/JSON pass) so the seeded catalogue is identical to what
the mock fallback showed — switching to the real API changes nothing
visible except that the data is now persisted.

Idempotent: exits early if properties already exist.
"""

import json
import re
from datetime import datetime
from pathlib import Path

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.models import Property, User

MOCK_DATA = Path(__file__).resolve().parent.parent / "frontend" / "src" / "utils" / "mockData.js"

DEMO_PASSWORD = "password123"

# owner_id in mockData.js -> the demo account that should own those listings
USERS = [
    {"id": 2, "name": "Srujan", "email": "nnm23cs205@nmamit.in", "role": "seller"},
    {"id": 3, "name": "Priya Sharma", "email": "priya@example.com", "role": "seller"},
    {"id": 4, "name": "Arjun Rao", "email": "arjun@example.com", "role": "seller"},
    {"id": 5, "name": "Demo Buyer", "email": "buyer@example.com", "role": "buyer"},
]


def parse_mock_properties():
    """Extract MOCK_PROPERTIES from the JS file as Python dicts."""
    source = MOCK_DATA.read_text(encoding="utf-8")

    start = source.index("export const MOCK_PROPERTIES = [")
    start = source.index("[", start)
    depth, end = 0, None
    for i in range(start, len(source)):
        if source[i] == "[":
            depth += 1
        elif source[i] == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    block = source[start:end]

    # Order matters: strip comments, quote keys (anchored to line starts so
    # "https:" inside URLs is untouched), inline the UNSPLASH() image helper,
    # then normalize quotes and trailing commas.
    block = re.sub(r"//[^\n]*", "", block)
    block = re.sub(r"^(\s*)([A-Za-z_]\w*):", r'\1"\2":', block, flags=re.M)
    block = re.sub(
        r"UNSPLASH\(\s*'([^']+)'\s*\)",
        lambda m: f'"https://images.unsplash.com/photo-{m.group(1)}?w=800&h=600&fit=crop&auto=format"',
        block,
    )
    block = re.sub(r"'([^']*)'", r'"\1"', block)     # single- -> double-quoted strings
    block = re.sub(r",(\s*[}\]])", r"\1", block)     # strip trailing commas

    return json.loads(block)


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Property).count() > 0:
        print("Database already seeded — nothing to do.")
        db.close()
        return

    id_map = {}
    for spec in USERS:
        user = db.query(User).filter(User.email == spec["email"]).first()
        if not user:
            user = User(
                name=spec["name"],
                email=spec["email"],
                hashed_password=hash_password(DEMO_PASSWORD),
                role=spec["role"],
            )
            db.add(user)
            db.flush()
        id_map[spec["id"]] = user.id
    db.commit()

    props = parse_mock_properties()
    for p in props:
        db.add(
            Property(
                title=p["title"],
                description=p.get("description", ""),
                property_type=p["property_type"],
                listing_type=p["listing_type"],
                price=p.get("price", 0),
                bedrooms=p.get("bedrooms", 0),
                bathrooms=p.get("bathrooms", 0),
                area_sqft=p.get("area_sqft", 0),
                city=p.get("city", ""),
                locality=p.get("locality", ""),
                address=p.get("address", ""),
                pincode=str(p.get("pincode", "")),
                latitude=p.get("latitude"),
                longitude=p.get("longitude"),
                amenities=p.get("amenities", []),
                images=p.get("images", []),
                status=p.get("status", "Active"),
                created_at=datetime.fromisoformat(p["created_at"].replace("Z", "+00:00")),
                owner_id=id_map.get(p.get("owner_id"), list(id_map.values())[0]),
            )
        )
    db.commit()

    print(f"Seeded {len(USERS)} users and {len(props)} properties.")
    print(f"Demo login: nnm23cs205@nmamit.in / {DEMO_PASSWORD}")
    db.close()


if __name__ == "__main__":
    main()
