import asyncio
from app.workers.celery_app import celery_app
from app.database.session import AsyncSessionLocal
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.trip import Trip, TripStatus, TripDay, TripActivity
from app.models.ai_session import AIAction, ActionStatus, TripConflict
from app.models.notification import NotificationType
from app.services.weather_service import WeatherService
from app.services.notification_service import NotificationService
from app.ai.replanning_agent import ReplanningAgent

@celery_app.task
def monitor_active_trips_weather():
    """Celery periodic task wrapper running async weather monitoring loop."""
    return asyncio.run(_run_weather_monitoring())

async def _run_weather_monitoring():
    weather_service = WeatherService()
    async with AsyncSessionLocal() as db:
        # Fetch active trips
        result = await db.execute(
            select(Trip)
            .where(Trip.status == TripStatus.ACTIVE)
            .options(selectinload(Trip.days).selectinload(TripDay.activities))
        )
        active_trips = result.scalars().all()

        for trip in active_trips:
            forecasts = await weather_service.get_forecast(15.4989, 73.8278, days=2)
            
            # Check if any day has rain > 70%
            high_rain_day = next((f for f in forecasts if f.get("rain_probability", 0) > 70.0), None)
            if high_rain_day:
                # Trigger Replanning Agent
                replan_agent = ReplanningAgent(db)
                prop = await replan_agent.propose_replan(trip.id, f"High rain probability ({high_rain_day['rain_probability']}%) detected.")

                # Store in ai_actions table
                action = AIAction(
                    trip_id=trip.id,
                    user_id=trip.user_id,
                    action_type="REPLACE_ACTIVITY",
                    action_data=prop,
                    status=ActionStatus.PROPOSED
                )
                db.add(action)

                # Store conflict in trip_conflicts table
                conflict = TripConflict(
                    trip_id=trip.id,
                    conflict_type="WEATHER_ALERT",
                    description=f"Rain probability {high_rain_day['rain_probability']}% forecasted for {high_rain_day['date']}.",
                    resolved=False
                )
                db.add(conflict)

                # Send notification to user
                notif_service = NotificationService(db)
                await notif_service.send_in_app(
                    user_id=trip.user_id,
                    type=NotificationType.WEATHER_ALERT,
                    title="Weather Alert: Outdoor Activity Re-plan Proposed",
                    body=f"High chance of rain detected during your trip to {trip.destination}. Tap to review the AI suggested indoor alternative.",
                    data={"trip_id": trip.id, "action_data": prop}
                )

        await db.commit()
    return f"Processed weather monitor for {len(active_trips)} active trips."
