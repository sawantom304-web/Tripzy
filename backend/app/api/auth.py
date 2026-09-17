from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshTokenRequest
from app.services.auth_service import AuthService
from app.utils.response_utils import success_response
from app.middleware.rate_limiter import rate_limit_dependency

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register")
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.register_user(req)
    return success_response(data=result, status_code=201)

@router.post("/login", dependencies=[Depends(rate_limit_dependency(max_requests=5, window_seconds=60))])
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.login_user(req)
    return success_response(data=result)

@router.post("/refresh")
async def refresh_token(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    result = await service.refresh_tokens(req.refresh_token)
    return success_response(data=result)

@router.post("/logout")
async def logout():
    return success_response(data={"message": "Logged out successfully."})
