from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, favorites, inquiries, properties

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HomeFind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(properties.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")
app.include_router(inquiries.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
