from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.booking import Booking, BookingStatus
from app.models.payment import Payment, PaymentStatus
from app.providers.razorpay_provider import RazorpayProvider
from app.utils.error_handler import AppException

class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.provider = RazorpayProvider()

    async def create_payment_order(self, booking_id: int, user_id: int) -> dict:
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id, Booking.user_id == user_id))
        booking = result.scalars().first()
        if not booking:
            raise AppException(code="BOOKING_NOT_FOUND", message="Booking not found.", status_code=404)

        order_data = await self.provider.create_order(
            amount=booking.amount,
            currency=booking.currency,
            receipt=booking.booking_reference
        )

        payment = Payment(
            booking_id=booking.id,
            user_id=user_id,
            razorpay_order_id=order_data["id"],
            amount=booking.amount,
            currency=booking.currency,
            status=PaymentStatus.CREATED,
            provider_response=order_data
        )
        self.db.add(payment)
        booking.status = BookingStatus.PAYMENT_PENDING
        await self.db.commit()

        return {
            "order_id": order_data["id"],
            "amount": booking.amount,
            "currency": booking.currency,
            "key_id": self.provider.key_id,
            "booking_id": booking.id
        }

    async def verify_payment(self, user_id: int, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> dict:
        is_valid = self.provider.verify_payment_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature)
        if not is_valid:
            raise AppException(code="INVALID_SIGNATURE", message="Payment verification failed due to invalid signature.", status_code=400)

        result = await self.db.execute(select(Payment).where(Payment.razorpay_order_id == razorpay_order_id))
        payment = result.scalars().first()
        if not payment:
            raise AppException(code="PAYMENT_NOT_FOUND", message="Payment order reference not found.", status_code=404)

        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = PaymentStatus.PAID

        # Update booking
        b_res = await self.db.execute(select(Booking).where(Booking.id == payment.booking_id))
        booking = b_res.scalars().first()
        if booking:
            booking.status = BookingStatus.PAID

        await self.db.commit()
        return {"status": "SUCCESS", "message": "Payment verified successfully.", "booking_id": payment.booking_id}

    async def handle_webhook(self, body_bytes: bytes, signature: str) -> dict:
        body_str = body_bytes.decode()
        if not self.provider.verify_webhook_signature(body_str, signature):
            raise AppException(code="INVALID_WEBHOOK_SIGNATURE", message="Razorpay webhook signature verification failed.", status_code=400)

        # Process payment payload
        import json
        payload = json.loads(body_str)
        event = payload.get("event")

        if event == "payment.captured":
            payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payment_entity.get("order_id")
            payment_id = payment_entity.get("id")

            if order_id:
                res = await self.db.execute(select(Payment).where(Payment.razorpay_order_id == order_id))
                payment = res.scalars().first()
                if payment:
                    payment.status = PaymentStatus.PAID
                    payment.razorpay_payment_id = payment_id

                    b_res = await self.db.execute(select(Booking).where(Booking.id == payment.booking_id))
                    booking = b_res.scalars().first()
                    if booking:
                        booking.status = BookingStatus.CONFIRMED
                    await self.db.commit()

        return {"status": "processed", "event": event}
