from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Inventory
from app.services.auth import require_role

router = APIRouter()


@router.get("/")
def list_inventory(db: Session = Depends(get_db)) -> list[dict]:
    inventory_rows = db.query(Inventory).all()
    return [
        {
            "id": row.id,
            "dress_id": row.dress_id,
            "dress_name": row.dress.name,
            "stock_quantity": row.stock_quantity,
            "low_stock_threshold": row.low_stock_threshold,
            "is_low_stock": row.stock_quantity < row.low_stock_threshold,
        }
        for row in inventory_rows
    ]


@router.put("/{inventory_id}", dependencies=[Depends(require_role("Admin", "Worker"))])
def update_inventory(inventory_id: int, payload: dict, db: Session = Depends(get_db)) -> dict:
    row = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Inventory entry not found")
    if "stock_quantity" in payload:
        row.stock_quantity = int(payload["stock_quantity"])
    if "low_stock_threshold" in payload:
        row.low_stock_threshold = int(payload["low_stock_threshold"])
    db.commit()
    return {"message": "Inventory updated"}
