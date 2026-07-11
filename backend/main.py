from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.api.auth import router as auth_router
from app.api.dresses import router as dresses_router
from app.api.inventory import router as inventory_router
from app.api.orders import router as orders_router
from app.api.upload import router as upload_router
from app.api.recommendations import router as recommendations_router
from app.db.database import create_db_and_tables

app = FastAPI(title="Dress Store Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(dresses_router, prefix="/api/dresses", tags=["dresses"])
app.include_router(inventory_router, prefix="/api/inventory", tags=["inventory"])
app.include_router(orders_router, prefix="/api/orders", tags=["orders"])
app.include_router(upload_router, prefix="/api/upload", tags=["upload"])
app.include_router(recommendations_router, prefix="/api/recommendations", tags=["recommendations"])


@app.on_event("startup")
def startup_event() -> None:
    try:
        create_db_and_tables()
    except OperationalError:
        print("MySQL is not reachable. Start MySQL and rerun the backend.")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
