from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserPreferenceUpdate(BaseModel):
    budget_preference: Optional[str] = None
    travel_style: Optional[str] = None
    food_preference: Optional[str] = None
    interests: Optional[List[str]] = None
    preferred_transport: Optional[str] = None
    preferred_accommodation: Optional[str] = None
    crowd_preference: Optional[str] = None
    walking_preference: Optional[str] = None

class UserPreferenceOut(BaseModel):
    user_id: int
    budget_preference: str
    travel_style: str
    food_preference: str
    interests: List[str]
    preferred_transport: str
    preferred_accommodation: str
    crowd_preference: str
    walking_preference: str

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
