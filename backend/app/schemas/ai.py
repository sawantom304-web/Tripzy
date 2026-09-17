from datetime import date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class PlanTripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget: float = Field(..., gt=0)
    travelers: int = Field(default=1, ge=1)
    prompt: Optional[str] = "Plan a balanced trip with top attractions, local food, and hidden gems."
    pace: str = "balanced" # relaxed, balanced, packed

class ChatRequest(BaseModel):
    trip_id: int
    message: str

class RecommendRequest(BaseModel):
    destination: str
    category: str # hotels, places, experiences, food
    budget: Optional[float] = None
    interests: List[str] = []

class ReplanRequest(BaseModel):
    trip_id: int
    reason: str # weather, user_request, activity_unavailable

class AIActionOut(BaseModel):
    id: int
    trip_id: int
    user_id: int
    action_type: str
    action_data: Dict[str, Any]
    status: str

    class Config:
        from_attributes = True
