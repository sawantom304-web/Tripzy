from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.review import Review
from app.models.booking import Booking, BookingStatus
from app.schemas.review import ReviewCreate, ReviewUpdate
from app.utils.error_handler import AppException

class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_review(self, user_id: int, req: ReviewCreate) -> Review:
        is_verified = False
        if req.booking_id:
            b_res = await self.db.execute(select(Booking).where(Booking.id == req.booking_id, Booking.user_id == user_id))
            booking = b_res.scalars().first()
            if not booking:
                raise AppException(code="INVALID_BOOKING", message="Booking not found for user.", status_code=400)
            if booking.status not in [BookingStatus.PAID, BookingStatus.CONFIRMED]:
                raise AppException(code="BOOKING_NOT_COMPLETED", message="Review can only be created after booking completion.", status_code=400)
            is_verified = True

        review = Review(
            user_id=user_id,
            business_id=req.business_id,
            hotel_id=req.hotel_id,
            booking_id=req.booking_id,
            rating=req.rating,
            review_text=req.review_text,
            is_verified=is_verified,
            is_moderated=True
        )
        self.db.add(review)
        await self.db.commit()
        await self.db.refresh(review)
        return review

    async def list_reviews(self, business_id: Optional[int] = None, hotel_id: Optional[int] = None) -> List[Review]:
        stmt = select(Review).where(Review.is_moderated == True)
        if business_id:
            stmt = stmt.where(Review.business_id == business_id)
        if hotel_id:
            stmt = stmt.where(Review.hotel_id == hotel_id)

        result = await self.db.execute(stmt.order_by(Review.created_at.desc()))
        return list(result.scalars().all())

    async def update_review(self, review_id: int, user_id: int, req: ReviewUpdate) -> Review:
        result = await self.db.execute(select(Review).where(Review.id == review_id))
        rev = result.scalars().first()
        if not rev:
            raise AppException(code="REVIEW_NOT_FOUND", message="Review not found.", status_code=404)
        if rev.user_id != user_id:
            raise AppException(code="FORBIDDEN", message="Cannot edit someone else's review.", status_code=403)

        for k, v in req.model_dump(exclude_unset=True).items():
            setattr(rev, k, v)
        await self.db.commit()
        await self.db.refresh(rev)
        return rev
