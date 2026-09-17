from typing import Any, Optional
from fastapi.responses import JSONResponse

def success_response(data: Any = None, status_code: int = 200) -> JSONResponse:
    """Standard success response format."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "data": data
        }
    )

def error_response(code: str, message: str, status_code: int = 400) -> JSONResponse:
    """Standardized error response format as per prompt requirements."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    )
