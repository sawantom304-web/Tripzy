import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from dotenv import load_dotenv

from app.database.session import init_db
from app.utils.error_handler import (
    AppException,
    app_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler
)

# API Routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.trips import router as trips_router
from app.api.ai import router as ai_router
from app.api.places import router as places_router
from app.api.hotels import router as hotels_router
from app.api.bookings import router as bookings_router
from app.api.payments import router as payments_router
from app.api.businesses import router as businesses_router
from app.api.reviews import router as reviews_router
from app.api.admin import router as admin_router

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schemas on startup if needed
    try:
        await init_db()
    except Exception as e:
        print(f"[DB INIT NOTICE] Database connection auto-init: {e}")
    yield

app = FastAPI(
    title="RoamIQ AI Travel Platform Backend API",
    description="Production-ready FastAPI backend for RoamIQ AI-powered smart travel planning platform.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Mount Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(trips_router)
app.include_router(ai_router)
app.include_router(places_router)
app.include_router(hotels_router)
app.include_router(bookings_router)
app.include_router(payments_router)
app.include_router(businesses_router)
app.include_router(reviews_router)
app.include_router(admin_router)

@app.get("/", tags=["Health Check"])
async def root():
    return {
        "success": True,
        "data": {
            "app": "RoamIQ AI Travel Platform Backend API",
            "status": "online",
            "version": "1.0.0",
            "demo_mode": os.getenv("DEMO_MODE", "true").lower() == "true",
            "docs": "/docs"
        }
    }
