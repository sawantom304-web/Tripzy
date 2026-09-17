from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class PlaceOut(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    rating: float = 4.0
    category: str = "attraction"
    opening_hours: Dict[str, Any] = {}
    photos: List[str] = []
    price_level: int = 2

    class Config:
        from_attributes = True

class PlaceSearchQuery(BaseModel):
    q: Optional[str] = None
    destination: Optional[str] = None
    category: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    radius: Optional[int] = 5000
