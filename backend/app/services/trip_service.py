from datetime import timedelta
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.trip import Trip, TripDay, TripActivity, TripStatus, ActivityStatus
from app.schemas.trip import TripCreate, TripUpdate, TripActivityCreate, TripActivityUpdate
from app.utils.error_handler import AppException

class TripService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_trip(self, user_id: int, req: TripCreate) -> Trip:
        trip = Trip(
            user_id=user_id,
            destination=req.destination,
            start_date=req.start_date,
            end_date=req.end_date,
            budget=req.budget,
            remaining_budget=req.budget,
            travelers=req.travelers,
            pace=req.pace,
            status=TripStatus.PLANNING
        )
        self.db.add(trip)
        await self.db.flush()

        # Build TripDays
        total_days = (req.end_date - req.start_date).days + 1
        if total_days < 1:
            total_days = 1

        for day_num in range(1, total_days + 1):
            day_date = req.start_date + timedelta(days=day_num - 1)
            t_day = TripDay(trip_id=trip.id, date=day_date, day_number=day_num)
            self.db.add(t_day)

        await self.db.commit()
        return await self.get_trip(trip.id, user_id)

    async def list_user_trips(self, user_id: int) -> List[Trip]:
        result = await self.db.execute(
            select(Trip)
            .where(Trip.user_id == user_id)
            .options(selectinload(Trip.days).selectinload(TripDay.activities))
            .order_by(Trip.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_trip(self, trip_id: int, user_id: Optional[int] = None) -> Trip:
        stmt = select(Trip).where(Trip.id == trip_id).options(selectinload(Trip.days).selectinload(TripDay.activities))
        if user_id is not None:
            stmt = stmt.where(Trip.user_id == user_id)
        result = await self.db.execute(stmt)
        trip = result.scalars().first()
        if not trip:
            raise AppException(code="TRIP_NOT_FOUND", message="Trip not found.", status_code=404)
        return trip

    async def update_trip(self, trip_id: int, user_id: int, req: TripUpdate) -> Trip:
        trip = await self.get_trip(trip_id, user_id)
        for k, v in req.model_dump(exclude_unset=True).items():
            setattr(trip, k, v)
        await self.db.commit()
        return await self.get_trip(trip_id, user_id)

    async def delete_trip(self, trip_id: int, user_id: int) -> bool:
        trip = await self.get_trip(trip_id, user_id)
        await self.db.delete(trip)
        await self.db.commit()
        return True

    async def update_activity(
        self,
        trip_id: int,
        day_id: int,
        activity_id: int,
        user_id: int,
        req: TripActivityUpdate
    ) -> TripActivity:
        # Verify ownership
        await self.get_trip(trip_id, user_id)
        
        result = await self.db.execute(
            select(TripActivity)
            .where(TripActivity.id == activity_id, TripActivity.trip_day_id == day_id)
        )
        act = result.scalars().first()
        if not act:
            raise AppException(code="ACTIVITY_NOT_FOUND", message="Activity not found.", status_code=404)

        for k, v in req.model_dump(exclude_unset=True).items():
            setattr(act, k, v)

        await self.db.commit()
        await self.db.refresh(act)
        return act
