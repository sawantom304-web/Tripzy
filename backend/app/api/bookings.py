from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.booking import BookingCreate, BookingOut
from app.services.booking_service import BookingService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("")
async def create_booking(req: BookingCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BookingService(db)
    booking = await service.create_booking(current_user.id, req)
    return success_response(data=BookingOut.model_validate(booking).model_dump(), status_code=201)

@router.get("")
async def list_bookings(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BookingService(db)
    bookings = await service.list_user_bookings(current_user.id)
    data = [BookingOut.model_validate(b).model_dump() for b in bookings]
    return success_response(data=data)

@router.get("/{booking_id}")
async def get_booking(booking_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BookingService(db)
    booking = await service.get_booking(booking_id, current_user.id)
    return success_response(data=BookingOut.model_validate(booking).model_dump())

@router.put("/{booking_id}/cancel")
async def cancel_booking(booking_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BookingService(db)
    booking = await service.cancel_booking(booking_id, current_user.id)
    return success_response(data=BookingOut.model_validate(booking).model_dump())
