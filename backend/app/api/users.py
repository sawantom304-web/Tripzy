from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.user import UserUpdate, UserPreferenceUpdate, UserOut, UserPreferenceOut
from app.services.user_service import UserService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/profile")
async def get_profile(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    user = await service.get_profile(current_user.id)
    return success_response(data=UserOut.model_validate(user).model_dump())

@router.put("/profile")
async def update_profile(req: UserUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    user = await service.update_profile(current_user.id, req)
    return success_response(data=UserOut.model_validate(user).model_dump())

@router.get("/preferences")
async def get_preferences(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    pref = await service.get_preferences(current_user.id)
    return success_response(data=UserPreferenceOut.model_validate(pref).model_dump())

@router.put("/preferences")
async def update_preferences(req: UserPreferenceUpdate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = UserService(db)
    pref = await service.update_preferences(current_user.id, req)
    return success_response(data=UserPreferenceOut.model_validate(pref).model_dump())
