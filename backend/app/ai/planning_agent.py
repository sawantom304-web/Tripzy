from typing import Dict, Any, List
from datetime import datetime, timedelta

class PlanningAgent:
    async def build_itinerary(
        self,
        research_data: Dict[str, Any],
        start_date_str: str,
        end_date_str: str,
        pace: str = "balanced"
    ) -> Dict[str, Any]:
        """Constructs day-by-day structured itinerary activities based on research data."""
        places = research_data.get("places", [])
        hotels = research_data.get("hotels", [])
        budget = research_data.get("budget", 20000.0)
        travelers = research_data.get("travelers", 1)

        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        num_days = (end_date - start_date).days + 1
        if num_days < 1:
            num_days = 1

        daily_activity_cap = 2 if pace == "relaxed" else (3 if pace == "balanced" else 4)

        days_plan = []
        place_idx = 0

        for day_num in range(1, num_days + 1):
            curr_date = start_date + timedelta(days=day_num - 1)
            day_activities = []
            
            # Morning Activity
            if place_idx < len(places):
                p = places[place_idx]
                day_activities.append({
                    "place_id": p.get("id"),
                    "title": f"Explore {p.get('name')}",
                    "description": f"Visit {p.get('name')} in {p.get('address', 'Goa')}. Enjoy the sights and ambiance.",
                    "start_time": "09:30",
                    "end_time": "12:00",
                    "duration_minutes": 150,
                    "cost": p.get("price_level", 2) * 200.0,
                    "latitude": p.get("latitude"),
                    "longitude": p.get("longitude"),
                    "sequence": 1,
                    "transport_to_next": "Cab",
                    "distance_to_next": "4.2 km",
                    "duration_to_next": "15 mins"
                })
                place_idx += 1

            # Lunch & Afternoon Activity
            if place_idx < len(places) and daily_activity_cap >= 2:
                p = places[place_idx]
                day_activities.append({
                    "place_id": p.get("id"),
                    "title": f"Lunch & Relax at {p.get('name')}",
                    "description": f"Sample local dishes and enjoy the coastal vibe at {p.get('name')}.",
                    "start_time": "13:00",
                    "end_time": "15:30",
                    "duration_minutes": 150,
                    "cost": p.get("price_level", 2) * 350.0,
                    "latitude": p.get("latitude"),
                    "longitude": p.get("longitude"),
                    "sequence": 2,
                    "transport_to_next": "Auto / Walk",
                    "distance_to_next": "2.1 km",
                    "duration_to_next": "10 mins"
                })
                place_idx += 1

            # Evening Sunset / Heritage Activity
            if daily_activity_cap >= 3:
                p = places[place_idx % len(places)] if places else {"name": "Sunset View Point", "price_level": 1}
                day_activities.append({
                    "place_id": p.get("id", "place_sunset_point"),
                    "title": f"Sunset Stroll at {p.get('name')}",
                    "description": "Watch the sunset, enjoy local street snacks, and photograph the scenic views.",
                    "start_time": "17:00",
                    "end_time": "19:30",
                    "duration_minutes": 150,
                    "cost": 250.0,
                    "latitude": p.get("latitude", 15.54),
                    "longitude": p.get("longitude", 73.75),
                    "sequence": 3,
                    "transport_to_next": "Walk",
                    "distance_to_next": "0.5 km",
                    "duration_to_next": "5 mins"
                })

            days_plan.append({
                "day_number": day_num,
                "date": curr_date.strftime("%Y-%m-%d"),
                "activities": day_activities
            })

        recommended_hotel = hotels[0] if hotels else None

        return {
            "destination": research_data.get("destination"),
            "days": days_plan,
            "recommended_hotel": recommended_hotel,
            "estimated_cost": budget * 0.85
        }
