from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.trip import Trip, TripDay, TripActivity
from app.models.user import UserPreference
from app.models.booking import Booking
from app.services.weather_service import WeatherService

class TripBrain:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.weather_service = WeatherService()

    async def get_trip_state(self, trip_id: int) -> Dict[str, Any]:
        """Assembles the complete trip state context as specified in RoamIQ specs."""
        result = await self.db.execute(
            select(Trip)
            .where(Trip.id == trip_id)
            .options(selectinload(Trip.days).selectinload(TripDay.activities))
        )
        trip = result.scalars().first()
        if not trip:
            return {}

        # Fetch user preferences
        p_res = await self.db.execute(select(UserPreference).where(UserPreference.user_id == trip.user_id))
        pref = p_res.scalars().first()
        preferences_list = pref.interests if pref and pref.interests else ["beaches", "food", "sightseeing"]

        # Fetch bookings
        b_res = await self.db.execute(select(Booking).where(Booking.trip_id == trip.id))
        bookings = b_res.scalars().all()
        bookings_list = [
            {
                "id": b.id,
                "type": str(b.booking_type.value),
                "reference": b.booking_reference,
                "amount": b.amount,
                "status": str(b.status.value)
            } for b in bookings
        ]

        # Flatten activities
        activities_list = []
        for day in trip.days:
            for act in day.activities:
                activities_list.append({
                    "id": act.id,
                    "day_number": day.day_number,
                    "date": day.date.strftime("%Y-%m-%d"),
                    "title": act.title,
                    "cost": act.cost,
                    "status": str(act.status.value),
                    "start_time": act.start_time,
                    "end_time": act.end_time
                })

        # Fetch current weather
        weather_info = await self.weather_service.get_current_weather(15.4989, 73.8278)

        return {
            "trip_id": trip.id,
            "destination": trip.destination,
            "dates": {
                "start": trip.start_date.strftime("%Y-%m-%d"),
                "end": trip.end_date.strftime("%Y-%m-%d")
            },
            "budget": trip.budget,
            "remaining_budget": trip.remaining_budget,
            "travelers": trip.travelers,
            "preferences": preferences_list,
            "pace": trip.pace,
            "current_location": {"destination": trip.destination},
            "current_activity": activities_list[0] if activities_list else {},
            "next_activity": activities_list[1] if len(activities_list) > 1 else {},
            "weather": weather_info,
            "bookings": bookings_list,
            "activities": activities_list,
            "constraints": {"pace": trip.pace}
        }
