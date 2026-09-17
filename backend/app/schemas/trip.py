from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.trip import TripStatus, ActivityStatus

class TripActivityCreate(BaseModel):
    place_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: int = 60
    cost: float = 0.0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    sequence: int = 1
    transport_to_next: Optional[str] = None
    distance_to_next: Optional[str] = None
    duration_to_next: Optional[str] = None

class TripActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    cost: Optional[float] = None
    status: Optional[ActivityStatus] = None
    sequence: Optional[int] = None

class TripActivityOut(BaseModel):
    id: int
    trip_day_id: int
    place_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: int
    cost: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: ActivityStatus
    sequence: int
    transport_to_next: Optional[str] = None
    distance_to_next: Optional[str] = None
    duration_to_next: Optional[str] = None

    class Config:
        from_attributes = True

class TripDayOut(BaseModel):
    id: int
    trip_id: int
    date: date
    day_number: int
    activities: List[TripActivityOut] = []

    class Config:
        from_attributes = True

class TripCreate(BaseModel):
    destination: str
    start_date: date
    end_date: date
    budget: float = Field(..., gt=0)
    travelers: int = Field(default=1, ge=1)
    pace: str = "balanced"

class TripUpdate(BaseModel):
    destination: Optional[str] = None
    budget: Optional[float] = None
    travelers: Optional[int] = None
    status: Optional[TripStatus] = None
    pace: Optional[str] = None

class TripOut(BaseModel):
    id: int
    user_id: int
    destination: str
    start_date: date
    end_date: date
    budget: float
    remaining_budget: float
    travelers: int
    status: TripStatus
    pace: str
    created_at: datetime
    days: List[TripDayOut] = []

    class Config:
        from_attributes = True
