from fastapi import Request, HTTPException
from fastapi.exceptions import RequestValidationError
from app.utils.response_utils import error_response

class AppException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)

async def app_exception_handler(request: Request, exc: AppException):
    return error_response(code=exc.code, message=exc.message, status_code=exc.status_code)

async def http_exception_handler(request: Request, exc: HTTPException):
    code = getattr(exc, "code", "HTTP_ERROR")
    return error_response(code=code, message=str(exc.detail), status_code=exc.status_code)

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = errors[0].get("msg") if errors else "Validation error"
    field = errors[0].get("loc", []) if errors else []
    field_str = " -> ".join([str(x) for x in field if str(x) != "body"])
    full_msg = f"{field_str}: {msg}" if field_str else msg
    return error_response(code="VALIDATION_ERROR", message=full_msg, status_code=422)

async def global_exception_handler(request: Request, exc: Exception):
    return error_response(
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected error occurred. Please try again later.",
        status_code=500
    )
