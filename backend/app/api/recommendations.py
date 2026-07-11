from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Dress, Recommendation, UploadedImage, User
from app.services.auth import get_current_user

router = APIRouter()


def heuristic_score(dress: Dress, features: dict[str, str]) -> float:
    score = 0.5
    category = dress.category.lower()
    if features.get("body_shape") == "hourglass" and category in {"women", "formal", "casual"}:
        score += 0.2
    if features.get("skin_tone") in {"warm", "cool"}:
        score += 0.1
    if features.get("color_preference") in {"red", "blue", "black"} and category in {"women", "formal"}:
        score += 0.2
    return round(min(score, 0.99), 2)


@router.post("/")
def generate_recommendations(payload: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[dict]:
    image_id = payload.get("image_id")
    if image_id is None:
        raise HTTPException(status_code=400, detail="Image id is required")

    uploaded_image = db.query(UploadedImage).filter(UploadedImage.id == image_id).first()
    if not uploaded_image:
        raise HTTPException(status_code=404, detail="Image not found")

    features = {
        "body_shape": "hourglass",
        "skin_tone": "warm",
        "color_preference": "blue",
    }

    dresses = db.query(Dress).filter(Dress.is_active.is_(True)).all()
    results = []
    for dress in dresses:
        score = heuristic_score(dress, features)
        if score > 0.5:
            results.append({"dress_id": dress.id, "name": dress.name, "category": dress.category, "price": float(dress.price), "score": score})

    results.sort(key=lambda item: item["score"], reverse=True)
    top_results = results[:5]

    for item in top_results:
        db.add(
            Recommendation(
                user_id=user.id,
                image_id=image_id,
                dress_id=item["dress_id"],
                confidence_score=item["score"],
                reason="Heuristic image-based recommendation",
            )
        )

    db.commit()
    return top_results
