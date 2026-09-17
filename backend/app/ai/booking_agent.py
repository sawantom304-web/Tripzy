from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.tools import ToolExecutor

class BookingAgent:
    def __init__(self, db: AsyncSession):
        self.executor = ToolExecutor(db)

    async def recommend_booking(self, destination: str, check_in: str, check_out: str, budget: float, guests: int = 1) -> Dict[str, Any]:
        hotels = await self.executor.execute_tool("search_hotels", {
            "destination": destination,
            "check_in": check_in,
            "check_out": check_out,
            "guests": guests,
            "budget": budget
        })

        best_option = hotels[0] if hotels else None

        return {
            "recommendation": best_option,
            "auto_pay": False,
            "message": "Here is the top-recommended hotel for your trip. Please review and click 'Proceed to Book' to complete payment.",
            "requires_explicit_user_action": True
        }
