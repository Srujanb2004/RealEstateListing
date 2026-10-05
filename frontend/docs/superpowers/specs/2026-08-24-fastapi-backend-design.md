# FastAPI Backend — Design Spec

Date: 2026-08-24
Status: Approved

## Purpose

The `frontend/` app (React + Vite) was built entirely against a documented
API contract ([frontend/CONTRACT.md](../../../frontend/CONTRACT.md)) and
currently runs on a mock-data/localStorage fallback because no backend
exists. This spec covers building that backend so the app runs against
real persisted data instead of the fallback.

Scope is fixed by what the frontend already calls — see
`frontend/src/services/{api,authService,propertyService,favoriteService,inquiryService}.js`.
No endpoints beyond what those files call are in scope.

## Stack

- **FastAPI** (Python, matches `frontend/README.md` / `CONTRACT.md`, which
  both already say "FastAPI backend")
- **SQLAlchemy** ORM, **SQLite** file DB (`backend/app.db`) — zero setup,
  no separate DB server needed for a demo-scale project
- **passlib[bcrypt]** for password hashing
- **python-jose** for JWT encode/decode
- **Pydantic** schemas for request/response validation (built into FastAPI)
- No Alembic — `Base.metadata.create_all()` on startup is sufficient at
  this scope; a migration tool would be unused ceremony for a
  single-developer app with no prior schema to migrate from.
- Images: **URL-only** — a Property's `images` field is a JSON array of
  URL strings, same as `mockData.js` today. No file upload endpoint, no
  disk/object storage.

## Project structure

```
backend/
  app/
    main.py            # FastAPI app, CORS, router registration, startup (create_all + seed check)
    database.py         # SQLAlchemy engine/session, Base
    models.py            # User, Property, Favorite, Inquiry ORM models
    schemas.py           # Pydantic request/response models
    auth.py               # password hashing, JWT encode/decode, get_current_user dependency
    deps.py                 # shared FastAPI dependencies (DB session, current user)
    routers/
      auth.py                  # /auth/register, /auth/login, /auth/me
      properties.py            # /properties CRUD + /properties/mine
      favorites.py             # /favorites
      inquiries.py             # /properties/{id}/inquiries, /inquiries/mine
    utils.py               # normalize_city/CITY_ALIASES (mirrors frontend constants.js), filtering/sorting helpers
  seed.py                # inserts MOCK_PROPERTIES-equivalent data + demo users
  requirements.txt
  README.md              # how to run
```

## Data models

### User
| field | type | notes |
|---|---|---|
| id | int, PK | |
| name | str | |
| email | str, unique, indexed | |
| hashed_password | str | |
| role | str | `buyer` \| `seller` |
| created_at | datetime | default now |

### Property
| field | type | notes |
|---|---|---|
| id | int, PK | |
| owner_id | int, FK→User | |
| title | str | |
| description | str | |
| property_type | str | one of `PROPERTY_TYPES` |
| listing_type | str | `Buy` \| `Rent` |
| price | int | |
| bedrooms | int | |
| bathrooms | int | |
| area_sqft | int | |
| city | str | |
| locality | str | |
| address | str | |
| pincode | str | |
| latitude | float | |
| longitude | float | |
| amenities | JSON (list[str]) | |
| images | JSON (list[str]) | URLs |
| status | str | one of `PROPERTY_STATUS`, default `Active` |
| created_at | datetime | default now |

### Favorite
| field | type | notes |
|---|---|---|
| id | int, PK | |
| user_id | int, FK→User | |
| property_id | int, FK→Property | |
| created_at | datetime | |

Unique constraint on `(user_id, property_id)`.

### Inquiry
| field | type | notes |
|---|---|---|
| id | int, PK | |
| property_id | int, FK→Property | |
| name | str | |
| email | str | |
| phone | str | |
| message | str | |
| status | str | default `sent` |
| created_at | datetime | |

## Endpoints

All under `/api` prefix (matches `VITE_API_URL=http://localhost:8000/api`).

### Auth
- `POST /auth/register` — body `{name, email, password, role}` → `{access_token, token_type, user}`. 400 if email already registered.
- `POST /auth/login` — form-urlencoded `username` (=email), `password` (matches `authService.login`'s `URLSearchParams` + `application/x-www-form-urlencoded`) → same shape. 401 on bad credentials.
- `GET /auth/me` — bearer auth → user object.

### Properties
- `GET /properties` — query params: `city, listing_type, property_type, min_price, max_price, bedrooms, sort`. Returns `{items: Property[], total: int}`.
  - Filtering mirrors `propertyService.js`'s `filterMock`: sequential predicate filters; city match uses `normalize_city` + bidirectional substring match against city and locality (port of `constants.js` `CITY_ALIASES`/`normalizeCity`).
  - `sort`: `price_asc`, `price_desc`, `area_desc`, default `newest` (by `created_at` desc).
- `GET /properties/{id}` → Property or 404.
- `POST /properties` — auth required → creates Property with `owner_id = current_user.id`.
- `PUT /properties/{id}` — auth + must be owner (403 otherwise).
- `DELETE /properties/{id}` — auth + must be owner.
- `GET /properties/mine` — auth → properties where `owner_id = current_user.id`.

### Favorites
- `GET /favorites` — auth → list of Property objects the user has favorited.
- `POST /favorites` — auth, body `{property_id}` → adds (idempotent — no-op if already favorited).
- `DELETE /favorites/{property_id}` — auth → removes.

### Inquiries
- `POST /properties/{id}/inquiries` — public, body `{name, email, phone, message}` → creates Inquiry linked to property.
- `GET /inquiries/mine` — auth → inquiries the user has sent (matched by email == current_user.email).
- `GET /properties/{id}/inquiries` — auth + must own the property → inquiries received for that listing.

## Auth flow

JWT bearer tokens, `sub` claim = user id, reasonable expiry (e.g. 7 days —
no refresh-token flow needed at this scope). `get_current_user` dependency
decodes the token, 401 if invalid/expired/missing (frontend already
handles 401 by clearing local session — [api.js:21](../../../frontend/src/services/api.js#L21)).

## Error handling

- 401 — missing/invalid/expired token
- 403 — authenticated but not the resource owner (edit/delete listing, view listing's inquiries)
- 404 — resource not found
- 422 — validation errors (FastAPI/Pydantic default)
- 400 — business-rule violations (duplicate email on register)

## Seed data

`seed.py` inserts:
- 4 demo users (buyer/seller roles) including one matching `MOCK_USER` (`nnm23cs205@nmamit.in`, seller)
- The same 32 properties currently in `frontend/src/utils/mockData.js`, so switching from mock fallback to the real API produces visually identical results — no empty-state surprise mid-demo.

Run once (`python seed.py`) before first use; script is idempotent (skips if properties already exist).

## Out of scope

- Image file upload/storage (URL-only per approved design)
- Password reset / email verification
- Pagination beyond returning full filtered set (frontend doesn't paginate today)
- Rate limiting, refresh tokens, RBAC beyond owner-check
- Deployment config (Docker, hosting) — local `uvicorn` run only

## Verification plan

1. `uvicorn app.main:app --reload` starts cleanly, creates `app.db`, seed script populates it.
2. Point `frontend/.env`'s `VITE_API_URL` at `http://localhost:8000/api`.
3. Re-run the same manual click-through already validated against mock data: home → search (city filter + sort) → property details → register/login (real accounts this time) → dashboard → create listing → verify it appears in `/dashboard/my-listings` and `/search` → favorite a property → submit an inquiry → confirm as the listing owner it shows up under that listing's inquiries.
4. Confirm 401 handling: hit a protected route with an invalid/expired token, confirm frontend redirects to login as it already does on 401.
