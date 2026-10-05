from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Favorite, Property, User
from ..schemas import FavoriteIn, FavoriteOut, PropertyOut

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=list[PropertyOut])
def list_favorites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns full Property objects — SavedProperties renders cards directly."""
    return (
        db.query(Property)
        .join(Favorite, Favorite.property_id == Property.id)
        .filter(Favorite.user_id == current_user.id)
        .all()
    )


@router.post("", response_model=FavoriteOut, status_code=201)
def add_favorite(
    payload: FavoriteIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.property_id == payload.property_id)
        .first()
    )
    if not existing:  # idempotent — saving twice is not an error
        db.add(Favorite(user_id=current_user.id, property_id=payload.property_id))
        db.commit()
    return FavoriteOut(property_id=payload.property_id)


@router.delete("/{property_id}")
def remove_favorite(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Favorite).filter(
        Favorite.user_id == current_user.id, Favorite.property_id == property_id
    ).delete()
    db.commit()
    return {"ok": True}
