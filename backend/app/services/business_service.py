from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.business import Business, BusinessStatus, BusinessProfile, Experience, Offer
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessProfileCreate, ExperienceCreate, OfferCreate
from app.utils.error_handler import AppException

class BusinessService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_business(self, owner_id: int, req: BusinessCreate) -> Business:
        business = Business(
            owner_id=owner_id,
            name=req.name,
            description=req.description,
            address=req.address,
            latitude=req.latitude,
            longitude=req.longitude,
            category=req.category,
            status=BusinessStatus.PENDING_VERIFICATION
        )
        self.db.add(business)
        await self.db.flush()

        if req.profile:
            profile = BusinessProfile(
                business_id=business.id,
                website=req.profile.website,
                social_links=req.profile.social_links,
                cover_image=req.profile.cover_image,
                gallery=req.profile.gallery
            )
            self.db.add(profile)

        await self.db.commit()
        await self.db.refresh(business)
        return business

    async def get_business(self, business_id: int) -> Business:
        result = await self.db.execute(select(Business).where(Business.id == business_id))
        b = result.scalars().first()
        if not b:
            raise AppException(code="BUSINESS_NOT_FOUND", message="Business profile not found.", status_code=404)
        return b

    async def update_business(self, business_id: int, owner_id: int, req: BusinessUpdate) -> Business:
        b = await self.get_business(business_id)
        if b.owner_id != owner_id:
            raise AppException(code="FORBIDDEN", message="Not authorized to edit this business.", status_code=403)

        for k, v in req.model_dump(exclude_unset=True).items():
            setattr(b, k, v)
        await self.db.commit()
        await self.db.refresh(b)
        return b

    async def add_experience(self, business_id: int, owner_id: int, req: ExperienceCreate) -> Experience:
        b = await self.get_business(business_id)
        if b.owner_id != owner_id:
            raise AppException(code="FORBIDDEN", message="Not authorized to add experiences.", status_code=403)

        exp = Experience(
            business_id=business_id,
            title=req.title,
            description=req.description,
            duration_minutes=req.duration_minutes,
            price_per_person=req.price_per_person,
            max_capacity=req.max_capacity,
            categories=req.categories
        )
        self.db.add(exp)
        await self.db.commit()
        await self.db.refresh(exp)
        return exp

    async def get_experiences(self, business_id: int) -> List[Experience]:
        result = await self.db.execute(select(Experience).where(Experience.business_id == business_id, Experience.is_active == True))
        return list(result.scalars().all())

    async def get_analytics(self, business_id: int, owner_id: int) -> dict:
        b = await self.get_business(business_id)
        if b.owner_id != owner_id:
            raise AppException(code="FORBIDDEN", message="Access denied.", status_code=403)

        return {
            "business_id": business_id,
            "total_views": 1240,
            "total_bookings": 38,
            "total_revenue": 185000.0,
            "average_rating": 4.7
        }
