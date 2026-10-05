from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Inquiry, Property, User
from ..schemas import (
    InquiryIn,
    InquiryOut,
    PropertyCreate,
    PropertyListOut,
    PropertyOut,
    PropertyUpdate,
)
from ..utils import SORTERS, city_matches

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=PropertyListOut)
def list_properties(
    db: Session = Depends(get_db),
    city: Optional[str] = None,
    listing_type: Optional[str] = None,
    property_type: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    bedrooms: Optional[int] = None,
    sort: Optional[str] = Query(default="newest"),
):
    query = db.query(Property)

    # Column filters push down to SQL; city matching needs the alias map so
    # it runs in Python over the already-narrowed set.
    if listing_type:
        query = query.filter(Property.listing_type == listing_type)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)

    results = query.all()

    if city:
        results = [p for p in results if city_matches(city, p.city, p.locality)]

    if sort in SORTERS:
        results.sort(key=SORTERS[sort])
    else:
        results.sort(key=lambda p: p.created_at, reverse=True)

    return PropertyListOut(items=results, total=len(results))


@router.get("/mine", response_model=list[PropertyOut])
def my_listings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Property)
        .filter(Property.owner_id == current_user.id)
        .order_by(Property.created_at.desc())
        .all()
    )


@router.get("/{property_id}", response_model=PropertyOut)
def get_property(property_id: int, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@router.post("", response_model=PropertyOut, status_code=201)
def create_property(
    payload: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = Property(**payload.model_dump(), owner_id=current_user.id)
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


def _owned_property(property_id: int, db: Session, current_user: User) -> Property:
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if prop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your listing")
    return prop


@router.put("/{property_id}", response_model=PropertyOut)
def update_property(
    property_id: int,
    payload: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = _owned_property(property_id, db, current_user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(prop, field, value)
    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/{property_id}")
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prop = _owned_property(property_id, db, current_user)
    db.delete(prop)
    db.commit()
    return {"ok": True}


# ---- inquiries scoped to a property -------------------------------------


@router.post("/{property_id}/inquiries", response_model=InquiryOut, status_code=201)
def create_inquiry(property_id: int, payload: InquiryIn, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    inquiry = Inquiry(property_id=property_id, **payload.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get("/{property_id}/inquiries", response_model=list[InquiryOut])
def listing_inquiries(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _owned_property(property_id, db, current_user)
    return (
        db.query(Inquiry)
        .filter(Inquiry.property_id == property_id)
        .order_by(Inquiry.created_at.desc())
        .all()
    )
