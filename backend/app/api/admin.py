from typing import List, Optional
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.middleware.auth_middleware import require_roles
from app.models.user import User
from app.models.business import Business, BusinessStatus
from app.models.review import Review
from app.models.booking import Booking
from app.models.payment import Payment, PaymentStatus
from app.schemas.user import UserOut
from app.schemas.business import BusinessOut
from app.schemas.review import ReviewOut
from app.utils.response_utils import success_response
from app.utils.error_handler import AppException

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Dashboard"],
    dependencies=[Depends(require_roles(["ADMIN"]))]
)

@router.get("/users")
async def list_all_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.id.desc()))
    users = result.scalars().all()
    data = [UserOut.model_validate(u).model_dump() for u in users]
    return success_response(data=data)

@router.put("/users/{user_id}/status")
async def update_user_status(user_id: int, is_active: bool = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise AppException(code="USER_NOT_FOUND", message="User not found.", status_code=404)
    user.is_active = is_active
    await db.commit()
    await db.refresh(user)
    return success_response(data=UserOut.model_validate(user).model_dump())

@router.get("/businesses")
async def list_all_businesses(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Business).order_by(Business.id.desc()))
    businesses = result.scalars().all()
    data = [BusinessOut.model_validate(b).model_dump() for b in businesses]
    return success_response(data=data)

@router.put("/businesses/{business_id}/verify")
async def verify_business(business_id: int, status: BusinessStatus = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Business).where(Business.id == business_id))
    b = result.scalars().first()
    if not b:
        raise AppException(code="BUSINESS_NOT_FOUND", message="Business not found.", status_code=404)
    b.status = status
    await db.commit()
    await db.refresh(b)
    return success_response(data=BusinessOut.model_validate(b).model_dump())

@router.get("/reviews")
async def list_all_reviews(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).order_by(Review.id.desc()))
    reviews = result.scalars().all()
    data = [ReviewOut.model_validate(r).model_dump() for r in reviews]
    return success_response(data=data)

@router.put("/reviews/{review_id}/moderate")
async def moderate_review(review_id: int, is_moderated: bool = Body(..., embed=True), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).where(Review.id == review_id))
    r = result.scalars().first()
    if not r:
        raise AppException(code="REVIEW_NOT_FOUND", message="Review not found.", status_code=404)
    r.is_moderated = is_moderated
    await db.commit()
    await db.refresh(r)
    return success_response(data=ReviewOut.model_validate(r).model_dump())

@router.get("/reports/bookings")
async def get_booking_report(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking))
    bookings = result.scalars().all()
    return success_response(data={"total_bookings": len(bookings)})

@router.get("/reports/revenue")
async def get_revenue_report(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payment).where(Payment.status == PaymentStatus.PAID))
    payments = result.scalars().all()
    total_rev = sum(p.amount for p in payments)
    return success_response(data={"total_revenue": total_rev, "currency": "INR", "successful_payments": len(payments)})
