import enum
from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class BookingType(str, enum.Enum):
    HOTEL = "HOTEL"
    EXPERIENCE = "EXPERIENCE"

class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAYMENT_PENDING = "PAYMENT_PENDING"
    PAID = "PAID"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="SET NULL"), nullable=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id", ondelete="SET NULL"), nullable=True)
    experience_id = Column(Integer, ForeignKey("experiences.id", ondelete="SET NULL"), nullable=True)
    booking_reference = Column(String(100), unique=True, index=True, nullable=False)
    booking_type = Column(Enum(BookingType), default=BookingType.HOTEL, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    check_in = Column(Date, nullable=True)
    check_out = Column(Date, nullable=True)
    guests = Column(Integer, default=1)
    raw_provider_response = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="bookings")
    trip = relationship("Trip", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="booking")
