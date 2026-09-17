import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.booking import Booking, BookingStatus, BookingType
from app.schemas.booking import BookingCreate
from app.services.hotel_service import HotelService
from app.utils.error_handler import AppException

class BookingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.hotel_service = HotelService()

    async def create_booking(self, user_id: int, req: BookingCreate) -> Booking:
        ref = f"RMQ-{uuid.uuid4().hex[:8].upper()}"

        # If booking a hotel, check latest availability and rate
        if req.booking_type == BookingType.HOTEL and req.hotel_id:
            avail = await self.hotel_service.check_availability(
                hotel_id=str(req.hotel_id),
                check_in=str(req.check_in) if req.check_in else "",
                check_out=str(req.check_out) if req.check_out else "",
                guests=req.guests
            )
            if not avail.get("available"):
                raise AppException(code="HOTEL_UNAVAILABLE", message="Selected hotel is not available for requested dates.", status_code=400)

        booking = Booking(
            user_id=user_id,
            trip_id=req.trip_id,
            hotel_id=req.hotel_id,
            experience_id=req.experience_id,
            booking_reference=ref,
            booking_type=req.booking_type,
            status=BookingStatus.PENDING,
            amount=req.amount,
            currency=req.currency,
            check_in=req.check_in,
            check_out=req.check_out,
            guests=req.guests
        )
        self.db.add(booking)
        await self.db.commit()
        await self.db.refresh(booking)
        return booking

    async def list_user_bookings(self, user_id: int) -> List[Booking]:
        result = await self.db.execute(select(Booking).where(Booking.user_id == user_id).order_by(Booking.created_at.desc()))
        return list(result.scalars().all())

    async def get_booking(self, booking_id: int, user_id: int) -> Booking:
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id, Booking.user_id == user_id))
        booking = result.scalars().first()
        if not booking:
            raise AppException(code="BOOKING_NOT_FOUND", message="Booking not found.", status_code=404)
        return booking

    async def cancel_booking(self, booking_id: int, user_id: int) -> Booking:
        booking = await self.get_booking(booking_id, user_id)
        if booking.status in [BookingStatus.CANCELLED, BookingStatus.REFUNDED]:
            raise AppException(code="ALREADY_CANCELLED", message="Booking is already cancelled.", status_code=400)

        if booking.booking_type == BookingType.HOTEL:
            await self.hotel_service.cancel_booking(booking.booking_reference)

        booking.status = BookingStatus.CANCELLED
        await self.db.commit()
        await self.db.refresh(booking)
        return booking
