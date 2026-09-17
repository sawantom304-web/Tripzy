import asyncio
from app.workers.celery_app import celery_app
from app.database.session import AsyncSessionLocal
from sqlalchemy import select
from app.models.trip import Trip, TripStatus
from app.models.notification import NotificationType
from app.services.notification_service import NotificationService

@celery_app.task
def monitor_upcoming_trip_reminders():
    return asyncio.run(_run_trip_reminders())

async def _run_trip_reminders():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Trip).where(Trip.status.in_([TripStatus.PLANNING, TripStatus.ACTIVE])))
        trips = result.scalars().all()
        notif_service = NotificationService(db)

        for trip in trips:
            # Check for upcoming reminders
            await notif_service.send_in_app(
                user_id=trip.user_id,
                type=NotificationType.ACTIVITY_REMINDER,
                title=f"Upcoming Activity in {trip.destination}",
                body="Your scheduled activity starts soon. Check route distance and transportation details in RoamIQ.",
                data={"trip_id": trip.id}
            )

        await db.commit()
    return f"Processed reminders for {len(trips)} trips."
