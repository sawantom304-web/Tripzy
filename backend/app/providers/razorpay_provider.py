import os
import hmac
import hashlib
from typing import Dict, Any

class RazorpayProvider:
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mockkey12345")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET", "mockrazorpaysecretkey12345")
        self.webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "mockwebhooksecret12345")
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

    async def create_order(self, amount: float, currency: str = "INR", receipt: str = "") -> Dict[str, Any]:
        """Creates a Razorpay order or returns a mock order response when DEMO_MODE=true."""
        amount_paise = int(amount * 100)
        
        if not self.demo_mode:
            try:
                import razorpay
                client = razorpay.Client(auth=(self.key_id, self.key_secret))
                order = client.order.create({
                    "amount": amount_paise,
                    "currency": currency,
                    "receipt": receipt,
                    "payment_capture": 1
                })
                return order
            except Exception:
                pass

        # Mock Razorpay Order structure
        return {
            "id": f"order_mock_{receipt}_{int(amount)}",
            "entity": "order",
            "amount": amount_paise,
            "amount_paid": 0,
            "amount_due": amount_paise,
            "currency": currency,
            "receipt": receipt,
            "status": "created",
            "attempts": 0,
            "notes": {},
            "created_at": 1700000000
        }

    def verify_payment_signature(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """Verifies payment signature from Razorpay checkout response."""
        if self.demo_mode and razorpay_signature.startswith("mock_sig"):
            return True

        msg = f"{razorpay_order_id}|{razorpay_payment_id}"
        generated_signature = hmac.new(
            self.key_secret.encode(),
            msg.encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(generated_signature, razorpay_signature)

    def verify_webhook_signature(self, body_str: str, signature: str) -> bool:
        """Verifies Razorpay Webhook signature."""
        if self.demo_mode and signature.startswith("mock_webhook_sig"):
            return True

        generated_signature = hmac.new(
            self.webhook_secret.encode(),
            body_str.encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(generated_signature, signature)
