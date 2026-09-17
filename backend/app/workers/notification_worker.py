import asyncio
from app.workers.celery_app import celery_app
from app.providers.resend_provider import ResendProvider

@celery_app.task
def send_email_async(to_email: str, subject: str, body: str):
    return asyncio.run(_send_email(to_email, subject, body))

async def _send_email(to_email: str, subject: str, body: str):
    provider = ResendProvider()
    return await provider.send_email(to_email, subject, body)
