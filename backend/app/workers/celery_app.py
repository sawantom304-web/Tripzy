import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "roamiq_workers",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=[
        "app.workers.weather_monitor",
        "app.workers.trip_monitor",
        "app.workers.notification_worker"
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "check-weather-every-30-min": {
            "task": "app.workers.weather_monitor.monitor_active_trips_weather",
            "schedule": 1800.0 # 30 minutes
        },
        "check-trips-every-15-min": {
            "task": "app.workers.trip_monitor.monitor_upcoming_trip_reminders",
            "schedule": 900.0 # 15 minutes
        }
    }
)
