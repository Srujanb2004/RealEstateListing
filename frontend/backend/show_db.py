"""Presentation helper: prints every table's row count and a sample of rows.

Run with: python show_db.py
"""

import sqlite3
from pathlib import Path

DB = Path(__file__).resolve().parent / "app.db"


def show(table, columns, limit=5):
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    total = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    print(f"\n=== {table} ({total} rows) ===")

    cols = ", ".join(columns)
    rows = cur.execute(f"SELECT {cols} FROM {table} LIMIT {limit}").fetchall()

    widths = [max(len(c), 18) for c in columns]
    print(" | ".join(c.ljust(w) for c, w in zip(columns, widths)))
    print("-+-".join("-" * w for w in widths))
    for row in rows:
        print(" | ".join(str(row[c])[:18].ljust(w) for c, w in zip(columns, widths)))

    con.close()


if __name__ == "__main__":
    show("users", ["id", "name", "email", "role"])
    show("properties", ["id", "owner_id", "title", "city", "price", "listing_type"])
    show("favorites", ["id", "user_id", "property_id"])
    show("inquiries", ["id", "property_id", "name", "email", "status"])
