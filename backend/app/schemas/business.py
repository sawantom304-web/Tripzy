from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.business import BusinessStatus

class BusinessProfileCreate(BaseModel):
    website: Optional[str] = None
    social_links: Dict[str, str] = {}
    cover_image: Optional[str] = None
    gallery: List[str] = []

class BusinessCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: float
    longitude: float
    category: str
    profile: Optional[BusinessProfileCreate] = None

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    category: Optional[str] = None
    status: Optional[BusinessStatus] = None

class BusinessOut(BaseModel):
    id: int
    owner_id: int
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: float
    longitude: float
    category: str
    status: BusinessStatus
    created_at: datetime

    class Config:
        from_attributes = True

class ExperienceCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    description: Optional[str] = None
    duration_minutes: int = 120
    price_per_person: float = Field(..., gt=0)
    max_capacity: int = 10
    categories: List[str] = []

class ExperienceOut(BaseModel):
    id: int
    business_id: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    price_per_person: float
    max_capacity: int
    categories: List[str] = []
    is_active: bool

    class Config:
        from_attributes = True

class OfferCreate(BaseModel):
    experience_id: Optional[int] = None
    discount_percent: float = Field(..., gt=0, le=100)
    valid_until: datetime

class OfferOut(BaseModel):
    id: int
    business_id: int
    experience_id: Optional[int] = None
    discount_percent: float
    valid_until: datetime

    class Config:
        from_attributes = True
