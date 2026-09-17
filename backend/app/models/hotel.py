from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from app.database.base import Base

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(String(200), unique=True, index=True, nullable=True) # booking.com ID or mock ID
    name = Column(String(255), nullable=False, index=True)
    destination = Column(String(200), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rating = Column(Float, default=4.0)
    price_per_night = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    amenities = Column(JSON, default=list)
    photos = Column(JSON, default=list)
    distance_from_city_center = Column(Float, default=0.0)
    cancellation_policy = Column(String(200), default="free_cancellation")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
