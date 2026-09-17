from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    business_id: Optional[int] = None
    hotel_id: Optional[int] = None
    booking_id: Optional[int] = None
    rating: float = Field(..., ge=1.0, le=5.0)
    review_text: str = Field(..., min_length=5)

class ReviewUpdate(BaseModel):
    rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    review_text: Optional[str] = None
    is_moderated: Optional[bool] = None

class ReviewOut(BaseModel):
    id: int
    user_id: int
    business_id: Optional[int] = None
    hotel_id: Optional[int] = None
    booking_id: Optional[int] = None
    rating: float
    review_text: str
    is_verified: bool
    is_moderated: bool
    created_at: datetime

    class Config:
        from_attributes = True
