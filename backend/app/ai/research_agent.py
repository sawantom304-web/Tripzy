from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.tools import ToolExecutor

class ResearchAgent:
    def __init__(self, db: AsyncSession):
        self.executor = ToolExecutor(db)

    async def gather_research(self, destination: str, dates: dict, preferences: List[str], budget: float, travelers: int) -> Dict[str, Any]:
        """Gathers research data strictly calling backend service tool functions."""
        places = await self.executor.execute_tool("search_places", {
            "destination": destination,
            "category": preferences[0] if preferences else "attraction",
            "limit": 10
        })

        hotels = await self.executor.execute_tool("search_hotels", {
            "destination": destination,
            "check_in": dates.get("start", ""),
            "check_out": dates.get("end", ""),
            "guests": travelers,
            "budget": budget * 0.4 # budget cap for hotel
        })

        weather = await self.executor.execute_tool("get_weather_forecast", {
            "destination": destination,
            "dates": str(dates)
        })

        return {
            "places": places,
            "hotels": hotels,
            "weather": weather,
            "destination": destination,
            "budget": budget,
            "travelers": travelers
        }
