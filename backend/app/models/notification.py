import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class NotificationType(str, enum.Enum):
    BOOKING_CONFIRMED = "BOOKING_CONFIRMED"
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS"
    TRIP_STARTS_TOMORROW = "TRIP_STARTS_TOMORROW"
    WEATHER_ALERT = "WEATHER_ALERT"
    ACTIVITY_REMINDER = "ACTIVITY_REMINDER"
    REPLANNING_SUGGESTION = "REPLANNING_SUGGESTION"
    BOOKING_CANCELLED = "BOOKING_CANCELLED"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)
    data = Column(JSON, default=dict)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
