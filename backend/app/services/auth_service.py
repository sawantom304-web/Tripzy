from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserPreference
from app.schemas.auth import RegisterRequest, LoginRequest
from app.utils.password_utils import hash_password, verify_password
from app.utils.jwt_utils import create_access_token, create_refresh_token, decode_refresh_token
from app.utils.error_handler import AppException

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, req: RegisterRequest) -> dict:
        result = await self.db.execute(select(User).where(User.email == req.email.lower()))
        existing = result.scalars().first()
        if existing:
            raise AppException(code="EMAIL_ALREADY_EXISTS", message="User with this email already exists.", status_code=400)

        hashed = hash_password(req.password)
        new_user = User(
            name=req.name,
            email=req.email.lower(),
            password_hash=hashed,
            role=req.role,
            phone=req.phone
        )
        self.db.add(new_user)
        await self.db.flush()

        pref = UserPreference(user_id=new_user.id)
        self.db.add(pref)
        await self.db.commit()
        await self.db.refresh(new_user)

        token_data = {"sub": str(new_user.id), "role": str(new_user.role.value)}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role": str(new_user.role.value)
            }
        }

    async def login_user(self, req: LoginRequest) -> dict:
        result = await self.db.execute(select(User).where(User.email == req.email.lower()))
        user = result.scalars().first()
        if not user or not verify_password(req.password, user.password_hash):
            raise AppException(code="INVALID_CREDENTIALS", message="Invalid email or password.", status_code=401)

        if not user.is_active:
            raise AppException(code="USER_INACTIVE", message="User account is deactivated.", status_code=403)

        token_data = {"sub": str(user.id), "role": str(user.role.value)}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": str(user.role.value)
            }
        }

    async def refresh_tokens(self, refresh_token: str) -> dict:
        payload = decode_refresh_token(refresh_token)
        if not payload:
            raise AppException(code="INVALID_REFRESH_TOKEN", message="Invalid or expired refresh token.", status_code=401)

        user_id = payload.get("sub")
        result = await self.db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalars().first()
        if not user or not user.is_active:
            raise AppException(code="USER_NOT_FOUND", message="User not found or inactive.", status_code=401)

        token_data = {"sub": str(user.id), "role": str(user.role.value)}
        new_access = create_access_token(token_data)
        new_refresh = create_refresh_token(token_data)

        return {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": str(user.role.value)
            }
        }
