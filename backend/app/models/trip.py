import enum
from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class TripStatus(str, enum.Enum):
    PLANNING = "PLANNING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ActivityStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    SKIPPED = "SKIPPED"
    CANCELLED = "CANCELLED"

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    destination = Column(String(200), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget = Column(Float, nullable=False, default=0.0)
    remaining_budget = Column(Float, nullable=False, default=0.0)
    travelers = Column(Integer, default=1, nullable=False)
    status = Column(Enum(TripStatus), default=TripStatus.PLANNING, nullable=False)
    pace = Column(String(50), default="balanced") # relaxed, balanced, packed
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="trips")
    days = relationship("TripDay", back_populates="trip", cascade="all, delete-orphan", order_by="TripDay.day_number")
    bookings = relationship("Booking", back_populates="trip")
    ai_actions = relationship("AIAction", back_populates="trip", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="trip", cascade="all, delete-orphan")

class TripDay(Base):
    __tablename__ = "trip_days"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    day_number = Column(Integer, nullable=False)

    trip = relationship("Trip", back_populates="days")
    activities = relationship("TripActivity", back_populates="day", cascade="all, delete-orphan", order_by="TripActivity.sequence")

class TripActivity(Base):
    __tablename__ = "trip_activities"

    id = Column(Integer, primary_key=True, index=True)
    trip_day_id = Column(Integer, ForeignKey("trip_days.id", ondelete="CASCADE"), nullable=False)
    place_id = Column(String(100), nullable=True) # google place id or place DB id
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(String(10), nullable=True) # "09:00"
    end_time = Column(String(10), nullable=True)   # "11:00"
    duration_minutes = Column(Integer, default=60)
    cost = Column(Float, default=0.0)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(Enum(ActivityStatus), default=ActivityStatus.PLANNED, nullable=False)
    sequence = Column(Integer, default=1)
    transport_to_next = Column(String(50), nullable=True)
    distance_to_next = Column(String(50), nullable=True)
    duration_to_next = Column(String(50), nullable=True)

    day = relationship("TripDay", back_populates="activities")
