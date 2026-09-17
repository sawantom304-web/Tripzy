import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base

class BusinessStatus(str, enum.Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    VERIFIED = "VERIFIED"
    SUSPENDED = "SUSPENDED"

class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    status = Column(Enum(BusinessStatus), default=BusinessStatus.PENDING_VERIFICATION, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="businesses")
    profile = relationship("BusinessProfile", back_populates="business", uselist=False, cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="business", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="business", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="business", cascade="all, delete-orphan")

class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, nullable=False)
    website = Column(String(255), nullable=True)
    social_links = Column(JSON, default=dict)
    cover_image = Column(String(500), nullable=True)
    gallery = Column(JSON, default=list)

    business = relationship("Business", back_populates="profile")

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=120)
    price_per_person = Column(Float, nullable=False)
    max_capacity = Column(Integer, default=10)
    categories = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    embedding = Column(JSON, nullable=True)

    business = relationship("Business", back_populates="experiences")
    offers = relationship("Offer", back_populates="experience", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "experience_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    experience_id = Column(Integer, ForeignKey("experiences.id", ondelete="CASCADE"), nullable=True)
    discount_percent = Column(Float, nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=False)

    business = relationship("Business", back_populates="offers")
    experience = relationship("Experience", back_populates="offers")
