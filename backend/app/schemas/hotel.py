from typing import Optional, List
from pydantic import BaseModel

class HotelOut(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    rating: float = 4.0
    price_per_night: float
    currency: str = "INR"
    amenities: List[str] = []
    photos: List[str] = []
    distance_from_city_center: float = 0.0
    cancellation_policy: str = "free_cancellation"

    class Config:
        from_attributes = True

class HotelSearchQuery(BaseModel):
    destination: str
    check_in: str
    check_out: str
    guests: int = 1
    budget: Optional[float] = None
