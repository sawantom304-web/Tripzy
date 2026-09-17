from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limiter import rate_limit_dependency
from app.schemas.ai import PlanTripRequest, ChatRequest, RecommendRequest, ReplanRequest
from app.ai.travel_manager import TravelManager
from app.ai.recommendation_agent import RecommendationAgent
from app.ai.replanning_agent import ReplanningAgent
from app.utils.response_utils import success_response

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Multi-Agent Engine"],
    dependencies=[Depends(rate_limit_dependency(max_requests=10, window_seconds=60))]
)

@router.post("/plan")
async def plan_trip(req: PlanTripRequest, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    tm = TravelManager(db)
    result = await tm.plan_trip(
        user_id=current_user.id,
        destination=req.destination,
        start_date=req.start_date,
        end_date=req.end_date,
        budget=req.budget,
        travelers=req.travelers,
        pace=req.pace
    )
    return success_response(data=result)

@router.post("/chat")
async def chat_with_ai(req: ChatRequest, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    tm = TravelManager(db)
    result = await tm.chat(user_id=current_user.id, trip_id=req.trip_id, message=req.message)
    return success_response(data=result)

@router.post("/recommend")
async def get_recommendations(req: RecommendRequest, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    tm = TravelManager(db)
    places = await tm.executor.execute_tool("search_places", {
        "destination": req.destination,
        "category": req.category
    })
    rec_agent = RecommendationAgent()
    ranked = await rec_agent.rank_items(places, req.interests, req.budget or 100000.0)
    return success_response(data={"destination": req.destination, "category": req.category, "recommendations": ranked})

@router.post("/replan")
async def replan_trip(req: ReplanRequest, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    agent = ReplanningAgent(db)
    proposed_change = await agent.propose_replan(req.trip_id, req.reason)
    return success_response(data=proposed_change)
