from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user, require_roles
from app.schemas.business import BusinessCreate, BusinessUpdate, BusinessOut, ExperienceCreate, ExperienceOut
from app.services.business_service import BusinessService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/businesses", tags=["Local Business Platform"])

@router.post("", dependencies=[Depends(require_roles(["PARTNER", "ADMIN"]))])
async def register_business(req: BusinessCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BusinessService(db)
    b = await service.register_business(current_user.id, req)
    return success_response(data=BusinessOut.model_validate(b).model_dump(), status_code=201)

@router.get("/{business_id}")
async def get_business(business_id: int, db: AsyncSession = Depends(get_db)):
    service = BusinessService(db)
    b = await service.get_business(business_id)
    return success_response(data=BusinessOut.model_validate(b).model_dump())

@router.put("/{business_id}", dependencies=[Depends(require_roles(["PARTNER", "ADMIN"]))])
async def update_business(business_id: int, req: BusinessUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BusinessService(db)
    b = await service.update_business(business_id, current_user.id, req)
    return success_response(data=BusinessOut.model_validate(b).model_dump())

@router.post("/{business_id}/experiences", dependencies=[Depends(require_roles(["PARTNER", "ADMIN"]))])
async def add_experience(business_id: int, req: ExperienceCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BusinessService(db)
    exp = await service.add_experience(business_id, current_user.id, req)
    return success_response(data=ExperienceOut.model_validate(exp).model_dump(), status_code=201)

@router.get("/{business_id}/experiences")
async def get_experiences(business_id: int, db: AsyncSession = Depends(get_db)):
    service = BusinessService(db)
    exps = await service.get_experiences(business_id)
    data = [ExperienceOut.model_validate(e).model_dump() for e in exps]
    return success_response(data=data)

@router.get("/{business_id}/analytics", dependencies=[Depends(require_roles(["PARTNER", "ADMIN"]))])
async def get_analytics(business_id: int, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = BusinessService(db)
    data = await service.get_analytics(business_id, current_user.id)
    return success_response(data=data)
