from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from app.database.base import Base

class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    google_place_id = Column(String(200), unique=True, index=True, nullable=True)
    name = Column(String(255), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    rating = Column(Float, default=4.0)
    category = Column(String(100), default="attraction", index=True)
    description = Column(Text, nullable=True)
    opening_hours = Column(JSON, default=dict)
    photos = Column(JSON, default=list)
    price_level = Column(Integer, default=2)
    embedding = Column(JSON, nullable=True) # Vector list representation for embedding match
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
