"""Pydantic request/response schemas.

Response shapes match what the React services already destructure, e.g.
`{ access_token, token_type, user }` from authService.login and
`{ items, total }` from propertyService.list.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# ---------------------------------------------------------------- users


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: str


class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "buyer"


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ----------------------------------------------------------- properties


class PropertyBase(BaseModel):
    title: str
    description: str = ""
    property_type: str
    listing_type: str
    price: int = 0
    bedrooms: int = 0
    bathrooms: int = 0
    area_sqft: int = 0
    city: str = ""
    locality: str = ""
    address: str = ""
    pincode: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: List[str] = []
    images: List[str] = []
    status: str = "Active"


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    """All fields optional — the edit form may send a partial payload."""

    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    listing_type: Optional[str] = None
    price: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area_sqft: Optional[int] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None
    status: Optional[str] = None


class PropertyOut(PropertyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    created_at: datetime


class PropertyListOut(BaseModel):
    items: List[PropertyOut]
    total: int


# ------------------------------------------------------------ favorites


class FavoriteIn(BaseModel):
    property_id: int


class FavoriteOut(BaseModel):
    property_id: int


# ------------------------------------------------------------ inquiries


class InquiryIn(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    message: str = ""


class InquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    property_id: int
    name: str
    email: str
    phone: str
    message: str
    status: str
    created_at: datetime
