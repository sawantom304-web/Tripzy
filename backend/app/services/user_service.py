from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserPreference
from app.schemas.user import UserUpdate, UserPreferenceUpdate
from app.utils.error_handler import AppException

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_profile(self, user_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise AppException(code="USER_NOT_FOUND", message="User profile not found.", status_code=404)
        return user

    async def update_profile(self, user_id: int, req: UserUpdate) -> User:
        user = await self.get_profile(user_id)
        if req.name is not None:
            user.name = req.name
        if req.phone is not None:
            user.phone = req.phone
        if req.profile_image is not None:
            user.profile_image = req.profile_image
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_preferences(self, user_id: int) -> UserPreference:
        result = await self.db.execute(select(UserPreference).where(UserPreference.user_id == user_id))
        pref = result.scalars().first()
        if not pref:
            pref = UserPreference(user_id=user_id)
            self.db.add(pref)
            await self.db.commit()
            await self.db.refresh(pref)
        return pref

    async def update_preferences(self, user_id: int, req: UserPreferenceUpdate) -> UserPreference:
        pref = await self.get_preferences(user_id)
        for key, val in req.model_dump(exclude_unset=True).items():
            setattr(pref, key, val)
        await self.db.commit()
        await self.db.refresh(pref)
        return pref
