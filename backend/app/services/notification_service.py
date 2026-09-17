from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.notification import Notification, NotificationType
from app.providers.resend_provider import ResendProvider

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.resend_provider = ResendProvider()

    async def send_in_app(
        self,
        user_id: int,
        type: NotificationType,
        title: str,
        body: str,
        data: Optional[dict] = None
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            type=type,
            title=title,
            body=body,
            data=data or {},
            is_read=False
        )
        self.db.add(notif)
        await self.db.commit()
        await self.db.refresh(notif)
        return notif

    async def send_email(self, to_email: str, subject: str, body: str) -> dict:
        return await self.resend_provider.send_email(to_email, subject, body)

    async def get_user_notifications(self, user_id: int) -> List[Notification]:
        result = await self.db.execute(
            select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
        )
        return list(result.scalars().all())

    async def mark_as_read(self, notification_id: int, user_id: int) -> Notification:
        result = await self.db.execute(
            select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
        )
        notif = result.scalars().first()
        if notif:
            notif.is_read = True
            await self.db.commit()
            await self.db.refresh(notif)
        return notif
