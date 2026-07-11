from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Role, User
from app.services.auth import create_access_token, get_password_hash, verify_password

router = APIRouter()


@router.post("/register")
def register(payload: dict[str, str], db: Session = Depends(get_db)) -> dict[str, str]:
    email = payload.get("email", "")
    password = payload.get("password", "")
    full_name = payload.get("full_name", "")
    role_name = payload.get("role", "Customer")

    if not email or not password or not full_name:
        raise HTTPException(status_code=400, detail="Missing required fields")

    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = User(full_name=full_name, email=email, password_hash=get_password_hash(password), role_id=role.id)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer", "role": role.name}


@router.post("/login")
def login(payload: dict[str, str], db: Session = Depends(get_db)) -> dict[str, str]:
    email = payload.get("email", "")
    password = payload.get("password", "")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing credentials")

    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer", "role": user.role.name}
