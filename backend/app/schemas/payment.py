from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.models.payment import PaymentStatus

class PaymentOrderCreate(BaseModel):
    booking_id: int

class PaymentOrderResponse(BaseModel):
    order_id: str
    amount: float
    currency: str
    key_id: str
    booking_id: int

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentOut(BaseModel):
    id: int
    booking_id: int
    user_id: int
    razorpay_order_id: str
    razorpay_payment_id: Optional[str] = None
    amount: float
    currency: str
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True
