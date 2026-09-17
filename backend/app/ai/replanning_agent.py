from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.tools import ToolExecutor

class ReplanningAgent:
    def __init__(self, db: AsyncSession):
        self.executor = ToolExecutor(db)

    async def propose_replan(self, trip_id: int, reason: str) -> Dict[str, Any]:
        """Analyzes conflict or user request and generates proposed AI Action for user approval."""
        trip_state = await self.executor.execute_tool("get_trip_state", {"trip_id": trip_id})
        
        # Indoor alternatives in Goa for heavy rain / bad weather
        indoor_alternatives = [
            {
                "title": "Visit Museum of Goa (Indoor Art & History)",
                "description": "Explore contemporary Goan history and art installations inside a fully covered modern museum.",
                "cost": 300.0,
                "duration_minutes": 120
            },
            {
                "title": "Spice Plantation Tour & Indoor Lunch",
                "description": "Covered guided spice walk followed by authentic Goan buffet lunch in a traditional sheltered pavilion.",
                "cost": 500.0,
                "duration_minutes": 180
            }
        ]

        proposed_change = {
            "trip_id": trip_id,
            "reason": reason,
            "action_type": "REPLACE_ACTIVITY",
            "proposed_activity": indoor_alternatives[0],
            "impact_analysis": {
                "budget_impact": "+₹300.0",
                "timing_adjusted": "10:00 AM - 12:00 PM",
                "weather_safety": "100% Indoor Shelter"
            },
            "requires_user_confirmation": True
        }

        return proposed_change
