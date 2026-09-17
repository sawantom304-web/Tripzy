from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.review import ReviewCreate, ReviewUpdate, ReviewOut
from app.services.review_service import ReviewService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/reviews", tags=["Reviews System"])

@router.post("")
async def create_review(req: ReviewCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    rev = await service.create_review(current_user.id, req)
    return success_response(data=ReviewOut.model_validate(rev).model_dump(), status_code=201)

@router.get("")
async def list_reviews(
    business_id: Optional[int] = Query(None),
    hotel_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    service = ReviewService(db)
    reviews = await service.list_reviews(business_id=business_id, hotel_id=hotel_id)
    data = [ReviewOut.model_validate(r).model_dump() for r in reviews]
    return success_response(data=data)

@router.put("/{review_id}")
async def update_review(review_id: int, req: ReviewUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = ReviewService(db)
    rev = await service.update_review(review_id, current_user.id, req)
    return success_response(data=ReviewOut.model_validate(rev).model_dump())
