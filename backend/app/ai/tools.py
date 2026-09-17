import json
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.maps_service import MapsService
from app.services.hotel_service import HotelService
from app.services.weather_service import WeatherService
from app.services.budget_engine import calculate_trip_cost as calc_cost
from app.ai.trip_brain import TripBrain

OPENAI_TOOLS_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "search_places",
            "description": "Search places and attractions by destination, category, and query.",
            "parameters": {
                "type": "object",
                "properties": {
                    "destination": {"type": "string"},
                    "category": {"type": "string"},
                    "query": {"type": "string"},
                    "limit": {"type": "integer", "default": 5}
                },
                "required": ["destination"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_experiences",
            "description": "Search local business experiences matching preferences and budget.",
            "parameters": {
                "type": "object",
                "properties": {
                    "destination": {"type": "string"},
                    "preferences": {"type": "array", "items": {"type": "string"}},
                    "budget_per_person": {"type": "number"}
                },
                "required": ["destination"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_place_details",
            "description": "Get details of a place by place_id.",
            "parameters": {
                "type": "object",
                "properties": {
                    "place_id": {"type": "string"}
                },
                "required": ["place_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_hotels",
            "description": "Search hotels by destination, check_in, check_out, guests, and budget.",
            "parameters": {
                "type": "object",
                "properties": {
                    "destination": {"type": "string"},
                    "check_in": {"type": "string"},
                    "check_out": {"type": "string"},
                    "guests": {"type": "integer"},
                    "budget": {"type": "number"}
                },
                "required": ["destination", "check_in", "check_out"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_hotel_details",
            "description": "Get detailed hotel specs.",
            "parameters": {
                "type": "object",
                "properties": {
                    "hotel_id": {"type": "string"}
                },
                "required": ["hotel_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_hotel_availability",
            "description": "Check live room availability for a hotel.",
            "parameters": {
                "type": "object",
                "properties": {
                    "hotel_id": {"type": "string"},
                    "check_in": {"type": "string"},
                    "check_out": {"type": "string"},
                    "guests": {"type": "integer"}
                },
                "required": ["hotel_id", "check_in", "check_out"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_weather_forecast",
            "description": "Get weather forecast for destination and dates.",
            "parameters": {
                "type": "object",
                "properties": {
                    "destination": {"type": "string"},
                    "dates": {"type": "string"}
                },
                "required": ["destination"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_route",
            "description": "Calculate transit distance and travel time between origin and destination.",
            "parameters": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string"},
                    "destination": {"type": "string"},
                    "mode": {"type": "string", "default": "driving"}
                },
                "required": ["origin", "destination"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_trip_cost",
            "description": "Deterministic trip cost calculator.",
            "parameters": {
                "type": "object",
                "properties": {
                    "hotel_cost": {"type": "number"},
                    "transport_cost": {"type": "number"},
                    "food_cost": {"type": "number"},
                    "activity_cost": {"type": "number"},
                    "travelers": {"type": "integer"}
                },
                "required": ["hotel_cost", "transport_cost", "food_cost", "activity_cost"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_trip_state",
            "description": "Get complete 360 degree state context of a trip.",
            "parameters": {
                "type": "object",
                "properties": {
                    "trip_id": {"type": "integer"}
                },
                "required": ["trip_id"]
            }
        }
    }
]

class ToolExecutor:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.maps_service = MapsService()
        self.hotel_service = HotelService()
        self.weather_service = WeatherService()
        self.trip_brain = TripBrain(db)

    async def execute_tool(self, name: str, args: dict) -> Any:
        if name == "search_places":
            return await self.maps_service.search_places(
                query=args.get("query"),
                location=args.get("destination"),
                category=args.get("category")
            )
        elif name == "get_place_details":
            return await self.maps_service.get_place_details(args.get("place_id", ""))
        elif name == "search_hotels":
            return await self.hotel_service.search_hotels(
                destination=args.get("destination", ""),
                check_in=args.get("check_in", ""),
                check_out=args.get("check_out", ""),
                guests=args.get("guests", 1),
                budget=args.get("budget")
            )
        elif name == "get_hotel_details":
            return await self.hotel_service.get_hotel_details(args.get("hotel_id", ""))
        elif name == "check_hotel_availability":
            return await self.hotel_service.check_availability(
                hotel_id=args.get("hotel_id", ""),
                check_in=args.get("check_in", ""),
                check_out=args.get("check_out", ""),
                guests=args.get("guests", 1)
            )
        elif name == "get_weather_forecast":
            return await self.weather_service.get_forecast(15.4989, 73.8278, days=5)
        elif name == "calculate_route":
            return await self.maps_service.calculate_route(args.get("origin", ""), args.get("destination", ""), args.get("mode", "driving"))
        elif name == "calculate_trip_cost":
            return calc_cost(
                hotel_cost=args.get("hotel_cost", 0),
                transport_cost=args.get("transport_cost", 0),
                food_cost=args.get("food_cost", 0),
                activity_cost=args.get("activity_cost", 0),
                travelers=args.get("travelers", 1)
            )
        elif name == "get_trip_state":
            return await self.trip_brain.get_trip_state(args.get("trip_id", 0))
        else:
            return {"status": "success", "message": f"Executed tool {name}"}
