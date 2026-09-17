from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.payment import PaymentOrderCreate, PaymentVerifyRequest
from app.services.payment_service import PaymentService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("/create-order")
async def create_order(req: PaymentOrderCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = PaymentService(db)
    result = await service.create_payment_order(req.booking_id, current_user.id)
    return success_response(data=result)

@router.post("/verify")
async def verify_payment(req: PaymentVerifyRequest, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    service = PaymentService(db)
    result = await service.verify_payment(
        user_id=current_user.id,
        razorpay_order_id=req.razorpay_order_id,
        razorpay_payment_id=req.razorpay_payment_id,
        razorpay_signature=req.razorpay_signature
    )
    return success_response(data=result)

@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(..., alias="X-Razorpay-Signature"),
    db: AsyncSession = Depends(get_db)
):
    body_bytes = await request.body()
    service = PaymentService(db)
    result = await service.handle_webhook(body_bytes, x_razorpay_signature)
    return success_response(data=result)
