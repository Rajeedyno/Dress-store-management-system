from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Dress, Inventory
from app.services.auth import require_role

router = APIRouter()


@router.get("/")
def list_dresses(category: str | None = None, db: Session = Depends(get_db)) -> list[dict]:
    query = db.query(Dress)
    if category:
        query = query.filter(Dress.category == category)
    dresses = query.all()
    return [
        {
            "id": dress.id,
            "name": dress.name,
            "category": dress.category,
            "description": dress.description,
            "price": float(dress.price),
            "image_url": dress.image_url,
            "stock": dress.inventory.stock_quantity if dress.inventory else 0,
        }
        for dress in dresses
    ]


@router.post("/", dependencies=[Depends(require_role("Admin"))])
def create_dress(payload: dict, db: Session = Depends(get_db)) -> dict:
    dress = Dress(**payload)
    db.add(dress)
    db.commit()
    db.refresh(dress)

    inventory = Inventory(dress_id=dress.id, stock_quantity=payload.get("stock_quantity", 0))
    db.add(inventory)
    db.commit()
    return {"id": dress.id, "message": "Dress created"}


@router.put("/{dress_id}", dependencies=[Depends(require_role("Admin"))])
def update_dress(dress_id: int, payload: dict, db: Session = Depends(get_db)) -> dict:
    dress = db.query(Dress).filter(Dress.id == dress_id).first()
    if not dress:
        raise HTTPException(status_code=404, detail="Dress not found")
    for key, value in payload.items():
        if key != "stock_quantity" and hasattr(dress, key):
            setattr(dress, key, value)
    db.commit()
    return {"message": "Dress updated"}


@router.delete("/{dress_id}", dependencies=[Depends(require_role("Admin"))])
def delete_dress(dress_id: int, db: Session = Depends(get_db)) -> dict:
    dress = db.query(Dress).filter(Dress.id == dress_id).first()
    if not dress:
        raise HTTPException(status_code=404, detail="Dress not found")
    db.delete(dress)
    db.commit()
    return {"message": "Dress deleted"}
