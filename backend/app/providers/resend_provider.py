import os
from typing import Dict, Any, Optional

class ResendProvider:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY", "")
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

    async def send_email(self, to_email: str, subject: str, body: str) -> Dict[str, Any]:
        if self.demo_mode or not self.api_key:
            print(f"[DEMO EMAIL SENDER] To: {to_email} | Subject: {subject}\nBody: {body}\n")
            return {"status": "sent", "email_id": f"mock_email_{hash(to_email + subject)}"}

        try:
            import resend
            resend.api_key = self.api_key
            r = resend.Emails.send({
                "from": "RoamIQ AI <noreply@roamiq.com>",
                "to": [to_email],
                "subject": subject,
                "html": f"<p>{body}</p>"
            })
            return {"status": "sent", "email_id": r.get("id")}
        except Exception as e:
            return {"status": "failed", "error": str(e)}
