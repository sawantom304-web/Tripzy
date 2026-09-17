import os
import json
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.research_agent import ResearchAgent
from app.ai.planning_agent import PlanningAgent
from app.ai.recommendation_agent import RecommendationAgent
from app.ai.replanning_agent import ReplanningAgent
from app.ai.booking_agent import BookingAgent
from app.ai.trip_brain import TripBrain
from app.ai.tools import OPENAI_TOOLS_DEFINITIONS, ToolExecutor
from app.services.trip_service import TripService
from app.schemas.trip import TripCreate

class TravelManager:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.research_agent = ResearchAgent(db)
        self.planning_agent = PlanningAgent()
        self.recommendation_agent = RecommendationAgent()
        self.replanning_agent = ReplanningAgent(db)
        self.booking_agent = BookingAgent(db)
        self.trip_brain = TripBrain(db)
        self.executor = ToolExecutor(db)
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

    async def plan_trip(self, user_id: int, destination: str, start_date: str, end_date: str, budget: float, travelers: int, pace: str = "balanced") -> Dict[str, Any]:
        """Master orchestration flow for generating full smart itinerary."""
        # 1. Gather Research Data
        dates = {"start": start_date, "end": end_date}
        research_data = await self.research_agent.gather_research(
            destination=destination,
            dates=dates,
            preferences=["beaches", "local_food", "hidden_gems"],
            budget=budget,
            travelers=travelers
        )

        # 2. Build Itinerary Plan
        itinerary = await self.planning_agent.build_itinerary(
            research_data=research_data,
            start_date_str=start_date,
            end_date_str=end_date,
            pace=pace
        )

        # 3. Save Trip in Database
        s_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        e_date = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        trip_service = TripService(self.db)
        trip = await trip_service.create_trip(
            user_id=user_id,
            req=TripCreate(
                destination=destination,
                start_date=s_date,
                end_date=e_date,
                budget=budget,
                travelers=travelers,
                pace=pace
            )
        )

        # Populate Trip Days and Activities
        for day_plan in itinerary.get("days", []):
            d_num = day_plan["day_number"]
            # Find matching day object
            t_day = next((d for d in trip.days if d.day_number == d_num), None)
            if t_day:
                for act in day_plan.get("activities", []):
                    from app.models.trip import TripActivity
                    activity = TripActivity(
                        trip_day_id=t_day.id,
                        place_id=act.get("place_id"),
                        title=act.get("title", "Attraction Visit"),
                        description=act.get("description"),
                        start_time=act.get("start_time"),
                        end_time=act.get("end_time"),
                        duration_minutes=act.get("duration_minutes", 60),
                        cost=act.get("cost", 0.0),
                        latitude=act.get("latitude"),
                        longitude=act.get("longitude"),
                        sequence=act.get("sequence", 1),
                        transport_to_next=act.get("transport_to_next"),
                        distance_to_next=act.get("distance_to_next"),
                        duration_to_next=act.get("duration_to_next")
                    )
                    self.db.add(activity)

        await self.db.commit()
        full_trip = await trip_service.get_trip(trip.id, user_id)

        return {
            "trip": full_trip,
            "itinerary": itinerary,
            "message": f"Successfully planned a {pace} {destination} trip with RoamIQ multi-agent engine."
        }

    async def chat(self, user_id: int, trip_id: int, message: str) -> Dict[str, Any]:
        """Conversational AI orchestrator for trip modifications."""
        trip_state = await self.trip_brain.get_trip_state(trip_id)

        # Handle fallback conversational responses in DEMO_MODE or without valid OpenAI key
        if self.demo_mode or not self.api_key or self.api_key.startswith("sk-proj-mock"):
            lowered = message.lower()
            if "hotel" in lowered or "stay" in lowered:
                rec = await self.booking_agent.recommend_booking(
                    destination=trip_state.get("destination", "Goa"),
                    check_in=trip_state.get("dates", {}).get("start", "2026-10-10"),
                    check_out=trip_state.get("dates", {}).get("end", "2026-10-14"),
                    budget=trip_state.get("budget", 20000.0) * 0.4,
                    guests=trip_state.get("travelers", 1)
                )
                return {
                    "response": rec["message"],
                    "data": rec["recommendation"]
                }
            elif "weather" in lowered or "rain" in lowered:
                replan_prop = await self.replanning_agent.propose_replan(trip_id, "Rain predicted during outdoor activity")
                return {
                    "response": "I detected a weather forecast update! Here is a proposed indoor alternative for your trip.",
                    "proposed_action": replan_prop
                }
            else:
                return {
                    "response": f"I've updated your RoamIQ trip context for '{message}'. What else would you like to adjust?",
                    "trip_state": trip_state
                }

        # Live OpenAI Integration
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self.api_key)

            sys_prompt = f"You are RoamIQ Travel Manager Agent. Current trip context:\n{json.dumps(trip_state)}"
            messages = [
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": message}
            ]

            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                tools=OPENAI_TOOLS_DEFINITIONS,
                tool_choice="auto"
            )

            msg = response.choices[0].message
            if msg.tool_calls:
                tool_call = msg.tool_calls[0]
                t_name = tool_call.function.name
                t_args = json.loads(tool_call.function.arguments)
                tool_result = await self.executor.execute_tool(t_name, t_args)
                return {
                    "response": f"Executed action '{t_name}' based on your request.",
                    "tool_used": t_name,
                    "result": tool_result
                }

            return {"response": msg.content or "How else can I assist with your trip?"}
        except Exception as e:
            return {"response": f"RoamIQ Assistant response: {message}. (Note: {str(e)})"}
