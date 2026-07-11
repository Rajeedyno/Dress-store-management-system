from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Dress, Inventory, Order, OrderItem, User
from app.services.auth import get_current_user, require_role

router = APIRouter()


@router.post("/")
def create_order(payload: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict:
    items = payload.get("items", [])
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0
    for item in items:
        dress = db.query(Dress).filter(Dress.id == item["dress_id"]).first()
        if not dress:
            raise HTTPException(status_code=404, detail="Dress not found")
        inventory = db.query(Inventory).filter(Inventory.dress_id == dress.id).first()
        if not inventory or inventory.stock_quantity < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {dress.name}")
        total_amount += float(dress.price) * item["quantity"]

    order = Order(customer_id=user.id, total_amount=total_amount, status="Pending")
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in items:
        dress = db.query(Dress).filter(Dress.id == item["dress_id"]).first()
        inventory = db.query(Inventory).filter(Inventory.dress_id == dress.id).first()
        inventory.stock_quantity -= item["quantity"]
        db.add(OrderItem(order_id=order.id, dress_id=dress.id, quantity=item["quantity"], price_per_unit=dress.price))

    db.commit()
    return {"message": "Order created", "order_id": order.id}


@router.get("/")
def list_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[dict]:
    if user.role.name == "Customer":
        orders = db.query(Order).filter(Order.customer_id == user.id).all()
    else:
        orders = db.query(Order).all()
    return [
        {"id": order.id, "status": order.status, "total_amount": float(order.total_amount), "created_at": str(order.created_at)}
        for order in orders
    ]


@router.put("/{order_id}", dependencies=[Depends(require_role("Admin", "Worker"))])
def update_order(order_id: int, payload: dict, db: Session = Depends(get_db)) -> dict:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if "status" in payload:
        order.status = payload["status"]
    db.commit()
    return {"message": "Order updated"}
