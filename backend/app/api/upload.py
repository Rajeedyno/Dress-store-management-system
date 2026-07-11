from pathlib import Path
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import UploadedImage, User
from app.services.auth import get_current_user

router = APIRouter()

UPLOAD_DIR = Path("/tmp/dress_store_uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/")
def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> dict[str, Any]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        buffer.write(file.file.read())

    image_record = UploadedImage(user_id=user.id, file_name=file.filename, file_path=str(file_path), detected_features="body_shape:unknown;skin_tone:unknown;color_preference:unknown")
    db.add(image_record)
    db.commit()
    db.refresh(image_record)

    return {"message": "Image uploaded", "image_id": image_record.id, "file_path": str(file_path)}
