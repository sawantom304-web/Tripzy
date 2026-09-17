from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.trip import TripCreate, TripUpdate, TripActivityUpdate, TripOut, TripDayOut, TripActivityOut
from app.services.trip_service import TripService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/trips", tags=["Trips"])

@router.post("")
async def create_trip(req: TripCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TripService(db)
    trip = await service.create_trip(current_user.id, req)
    return success_response(data=TripOut.model_validate(trip).model_dump(), status_code=201)

@router.get("")
async def list_trips(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TripService(db)
    trips = await service.list_user_trips(current_user.id)
    data = [TripOut.model_validate(t).model_dump() for t in trips]
    return success_response(data=data)

@router.get("/{trip_id}")
async def get_trip(trip_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TripService(db)
    trip = await service.get_trip(trip_id, current_user.id)
    return success_response(data=TripOut.model_validate(trip).model_dump())

@router.put("/{trip_id}")
async def update_trip(trip_id: int, req: TripUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TripService(db)
    trip = await service.update_trip(trip_id, current_user.id, req)
    return success_response(data=TripOut.model_validate(trip).model_dump())

@router.delete("/{trip_id}")
async def delete_trip(trip_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TripService(db)
    await service.delete_trip(trip_id, current_user.id)
    return success_response(data={"message": "Trip deleted successfully."})

@router.get("/{trip_id}/days")
async def get_trip_days(trip_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = TripService(db)
    trip = await service.get_trip(trip_id, current_user.id)
    days_data = [TripDayOut.model_validate(d).model_dump() for d in trip.days]
    return success_response(data=days_data)

@router.put("/{trip_id}/days/{day_id}/activities/{activity_id}")
async def update_activity(
    trip_id: int,
    day_id: int,
    activity_id: int,
    req: TripActivityUpdate,
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = TripService(db)
    act = await service.update_activity(trip_id, day_id, activity_id, current_user.id, req)
    return success_response(data=TripActivityOut.model_validate(act).model_dump())
