"""ORM models.

Field names mirror the Property/User shapes the frontend already expects
(see frontend/src/utils/mockData.js and frontend/CONTRACT.md) so responses
drop straight into the existing React components with no mapping layer.
"""

from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="buyer")  # buyer | seller
    created_at = Column(DateTime, default=utcnow, nullable=False)

    properties = relationship("Property", back_populates="owner")
    favorites = relationship("Favorite", back_populates="user")


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, default="")
    property_type = Column(String, nullable=False)  # Apartment, House, ...
    listing_type = Column(String, nullable=False)  # Buy | Rent

    price = Column(Integer, default=0)
    bedrooms = Column(Integer, default=0)
    bathrooms = Column(Integer, default=0)
    area_sqft = Column(Integer, default=0)

    city = Column(String, default="", index=True)
    locality = Column(String, default="")
    address = Column(String, default="")
    pincode = Column(String, default="")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    amenities = Column(JSON, default=list)
    images = Column(JSON, default=list)

    status = Column(String, default="Active")
    created_at = Column(DateTime, default=utcnow, nullable=False)

    owner = relationship("User", back_populates="properties")
    inquiries = relationship(
        "Inquiry", back_populates="property", cascade="all, delete-orphan"
    )
    favorited_by = relationship(
        "Favorite", back_populates="property", cascade="all, delete-orphan"
    )


class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint("user_id", "property_id", name="uq_user_property"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow, nullable=False)

    user = relationship("User", back_populates="favorites")
    property = relationship("Property", back_populates="favorited_by")


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)

    name = Column(String, default="")
    email = Column(String, default="", index=True)
    phone = Column(String, default="")
    message = Column(Text, default="")
    status = Column(String, default="sent")
    created_at = Column(DateTime, default=utcnow, nullable=False)

    property = relationship("Property", back_populates="inquiries")
