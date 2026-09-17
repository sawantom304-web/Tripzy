from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.utils.jwt_utils import decode_access_token
from app.utils.error_handler import AppException

security = HTTPBearer(auto_error=False)

async def get_current_user_payload(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not credentials or not credentials.credentials:
        raise AppException(code="UNAUTHORIZED", message="Authentication credentials missing.", status_code=401)
    
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise AppException(code="INVALID_TOKEN", message="Invalid or expired access token.", status_code=401)
    
    return payload

async def get_current_user(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    from app.models.user import User
    user_id = payload.get("sub")
    if not user_id:
        raise AppException(code="INVALID_TOKEN", message="Token subject missing.", status_code=401)
    
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()
    if not user or not user.is_active:
        raise AppException(code="USER_NOT_FOUND", message="User not found or inactive.", status_code=401)
    
    return user

def require_roles(allowed_roles: List[str]):
    """Role-Based Access Control (RBAC) dependency factor."""
    async def role_checker(current_user = Depends(get_current_user)):
        user_role = str(current_user.role.value) if hasattr(current_user.role, "value") else str(current_user.role)
        if user_role not in allowed_roles:
            raise AppException(
                code="FORBIDDEN",
                message=f"Access denied. Requires one of roles: {', '.join(allowed_roles)}",
                status_code=403
            )
        return current_user
    return role_checker
