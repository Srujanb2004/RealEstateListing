# HomeFind — Backend API

FastAPI + SQLAlchemy + SQLite backend for the Real Estate Listing Platform.
Implements the API contract the React frontend was built against
(`frontend/CONTRACT.md`).

## Run it

```bash
cd backend
pip install -r requirements.txt
python seed.py                 # first time only — loads demo users + 32 properties
python -m uvicorn app.main:app --reload --port 8000
```

API runs at `http://localhost:8000/api`.
Interactive docs (Swagger UI): `http://localhost:8000/docs`

The frontend's `.env` already points at this URL, so with both servers
running the React app uses real data instead of its offline fallback.

## Demo accounts

All seeded accounts use the password `password123`:

| Email | Role |
|---|---|
| nnm23cs205@nmamit.in | seller |
| priya@example.com | seller |
| arjun@example.com | seller |
| buyer@example.com | buyer |

## Stack

- **FastAPI** — routing, validation, auto-generated OpenAPI docs
- **SQLAlchemy** — ORM over **SQLite** (`app.db`, created automatically)
- **bcrypt** — password hashing
- **python-jose** — JWT signing/verification (7-day expiry)

## Endpoints

### Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/register` | `{name, email, password, role}` → `{access_token, token_type, user}` |
| POST | `/api/auth/login` | form-encoded `username` (email) + `password` |
| GET | `/api/auth/me` | requires bearer token |

### Properties
| Method | Path | Notes |
|---|---|---|
| GET | `/api/properties` | filters: `city, listing_type, property_type, min_price, max_price, bedrooms, sort` |
| GET | `/api/properties/{id}` | |
| POST | `/api/properties` | auth; creates under current user |
| PUT | `/api/properties/{id}` | auth + owner only |
| DELETE | `/api/properties/{id}` | auth + owner only |
| GET | `/api/properties/mine` | auth; current user's listings |

`sort` accepts `newest` (default), `price_asc`, `price_desc`, `area_desc`.

### Favorites
| Method | Path | Notes |
|---|---|---|
| GET | `/api/favorites` | auth; returns full Property objects |
| POST | `/api/favorites` | auth; `{property_id}`, idempotent |
| DELETE | `/api/favorites/{property_id}` | auth |

### Inquiries
| Method | Path | Notes |
|---|---|---|
| POST | `/api/properties/{id}/inquiries` | public; `{name, email, phone, message}` |
| GET | `/api/properties/{id}/inquiries` | auth + owner only |
| GET | `/api/inquiries/mine` | auth; received on your listings + ones you sent |

## Structure

```
backend/
  app/
    main.py        FastAPI app, CORS, router registration
    database.py     engine/session/Base, get_db dependency
    models.py       User, Property, Favorite, Inquiry
    schemas.py      Pydantic request/response shapes
    auth.py         bcrypt hashing, JWT, get_current_user
    utils.py        city alias normalization + sort comparators
    routers/        auth, properties, favorites, inquiries
  seed.py          loads demo data (parsed from frontend mockData.js)
  app.db           SQLite database (generated)
```

## Design notes

- **City alias matching** — `utils.py` ports the frontend's `CITY_ALIASES`
  map, so searching "Bangalore" matches listings stored as "Bengaluru",
  and "Gurgaon"/"Noida" both resolve to "Delhi NCR".
- **Ownership enforcement** — edit/delete/inquiry-viewing all check
  `owner_id` against the token's user and return 403 on mismatch.
- **Images are URLs**, not uploaded files — matches how the frontend's
  seed data already stores them.
- **Error codes** — 401 invalid/expired token (frontend auto-clears the
  session), 403 not owner, 404 missing, 422 validation, 400 duplicate email.
