from datetime import date, datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field
from app.models.booking import BookingType, BookingStatus

class BookingCreate(BaseModel):
    trip_id: Optional[int] = None
    hotel_id: Optional[int] = None
    experience_id: Optional[int] = None
    booking_type: BookingType = BookingType.HOTEL
    amount: float = Field(..., gt=0)
    currency: str = "INR"
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    guests: int = 1

class BookingOut(BaseModel):
    id: int
    user_id: int
    trip_id: Optional[int] = None
    hotel_id: Optional[int] = None
    experience_id: Optional[int] = None
    booking_reference: str
    booking_type: BookingType
    status: BookingStatus
    amount: float
    currency: str
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    guests: int
    raw_provider_response: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

class BookingCancelRequest(BaseModel):
    reason: Optional[str] = None
