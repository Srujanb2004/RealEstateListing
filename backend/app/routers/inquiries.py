from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Inquiry, Property, User
from ..schemas import InquiryOut

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.get("/mine", response_model=list[InquiryOut])
def my_inquiries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Inquiries received on the current user's listings, plus ones they sent."""
    owned_ids = [
        row.id for row in db.query(Property.id).filter(Property.owner_id == current_user.id).all()
    ]
    return (
        db.query(Inquiry)
        .filter(
            (Inquiry.property_id.in_(owned_ids)) | (Inquiry.email == current_user.email)
        )
        .order_by(Inquiry.created_at.desc())
        .all()
    )
