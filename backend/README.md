# RoamIQ Backend API

Production-ready backend for **RoamIQ** — an AI-powered smart travel planning platform built with Python FastAPI, PostgreSQL (SQLAlchemy async + pgvector), Redis, Celery, OpenAI GPT-4o multi-agent AI system, Razorpay payments, Google Maps/Weather APIs, Booking.com API, Resend email, and DEMO_MODE mock providers.

---

## Features

- **Multi-Agent AI Travel Engine**: `TravelManager` orchestrates `ResearchAgent`, `PlanningAgent`, `RecommendationAgent`, `ReplanningAgent`, `BookingAgent`, and `TripBrain` with OpenAI function-calling tools.
- **Deterministic Budget Engine**: Pure Python financial calculations for accurate expense tracking without AI arithmetic.
- **Weather & Live Monitoring**: Celery background workers monitor weather every 30 mins; if rain probability > 70% during outdoor activities, the `ReplanningAgent` generates indoor alternatives and sends notifications.
- **Hotel & Experience Booking Engine**: Integrated with Razorpay order creation, payment signature verification, and secure Webhook processing.
- **Local Business Partner Platform**: Businesses register, list experiences, manage promotional offers, and view analytics.
- **Reviews & Moderation System**: Verified review badges linked to completed bookings with admin content moderation.
- **Role-Based Access Control (RBAC)**: Supports `TRAVELER`, `PARTNER`, and `ADMIN` user roles.
- **DEMO_MODE Support**: Runs standalone out of the box (`DEMO_MODE=true`) with realistic Goa mock hotel, weather, and payment providers.

---

## Folder Structure

```
backend/
├── .env.example
├── .gitignore
├── requirements.txt
├── alembic.ini
├── README.md
│
└── app/
    ├── main.py
    │
    ├── api/
    │   ├── auth.py
    │   ├── users.py
    │   ├── trips.py
    │   ├── ai.py
    │   ├── places.py
    │   ├── hotels.py
    │   ├── bookings.py
    │   ├── payments.py
    │   ├── businesses.py
    │   ├── reviews.py
    │   └── admin.py
    │
    ├── models/
    │   ├── user.py
    │   ├── trip.py
    │   ├── place.py
    │   ├── hotel.py
    │   ├── booking.py
    │   ├── payment.py
    │   ├── business.py
    │   ├── review.py
    │   ├── notification.py
    │   └── ai_session.py
    │
    ├── schemas/
    │   ├── auth.py
    │   ├── user.py
    │   ├── trip.py
    │   ├── place.py
    │   ├── hotel.py
    │   ├── booking.py
    │   ├── payment.py
    │   ├── business.py
    │   ├── review.py
    │   └── ai.py
    │
    ├── services/
    │   ├── auth_service.py
    │   ├── user_service.py
    │   ├── trip_service.py
    │   ├── hotel_service.py
    │   ├── maps_service.py
    │   ├── weather_service.py
    │   ├── payment_service.py
    │   ├── booking_service.py
    │   ├── business_service.py
    │   ├── review_service.py
    │   ├── notification_service.py
    │   └── budget_engine.py
    │
    ├── ai/
    │   ├── travel_manager.py
    │   ├── research_agent.py
    │   ├── planning_agent.py
    │   ├── recommendation_agent.py
    │   ├── replanning_agent.py
    │   ├── booking_agent.py
    │   ├── trip_brain.py
    │   └── tools.py
    │
    ├── providers/
    │   ├── google_maps.py
    │   ├── google_weather.py
    │   ├── booking_com.py
    │   ├── razorpay_provider.py
    │   ├── resend_provider.py
    │   ├── mock_hotel.py
    │   └── mock_weather.py
    │
    ├── database/
    │   ├── base.py
    │   ├── session.py
    │   └── migrations/
    │
    ├── workers/
    │   ├── celery_app.py
    │   ├── weather_monitor.py
    │   ├── trip_monitor.py
    │   └── notification_worker.py
    │
    ├── middleware/
    │   ├── auth_middleware.py
    │   └── rate_limiter.py
    │
    └── utils/
        ├── jwt_utils.py
        ├── password_utils.py
        ├── response_utils.py
        └── error_handler.py
```

---

## Setup & Installation

### 1. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `DEMO_MODE=true` allows running immediately without external API keys.

---

## Running Database Migrations

Ensure PostgreSQL is running and update `DATABASE_URL` in `.env` if needed.
```bash
# Run Alembic migrations
alembic upgrade head
```

---

## Starting the Server

Start the FastAPI application with Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API Documentation will be available at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Starting Celery Workers & Monitoring

Start Redis server:
```bash
redis-server
```

Start Celery Worker:
```bash
celery -A app.workers.celery_app worker --loglevel=info
```

Start Celery Beat Scheduler (for periodic weather & reminder checks):
```bash
celery -A app.workers.celery_app beat --loglevel=info
```

---

## API Endpoint Reference

### Authentication
- `POST /api/auth/register` — Register a new account (`TRAVELER`, `PARTNER`, or `ADMIN`)
- `POST /api/auth/login` — Login with credentials (returns JWT access & refresh tokens)
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Invalidate session

### User Profile & Preferences
- `GET /api/users/profile` — Get user profile
- `PUT /api/users/profile` — Update user profile details
- `GET /api/users/preferences` — Get travel preferences
- `PUT /api/users/preferences` — Update travel preferences (budget, style, food, transport)

### Trip Management
- `POST /api/trips` — Create a new trip container
- `GET /api/trips` — List user's trips
- `GET /api/trips/{id}` — Get trip details with day-by-day activities
- `PUT /api/trips/{id}` — Update trip details or pace
- `DELETE /api/trips/{id}` — Delete a trip
- `GET /api/trips/{id}/days` — Get itinerary days
- `PUT /api/trips/{id}/days/{day_id}/activities/{activity_id}` — Edit an activity

### AI Travel Engine
- `POST /api/ai/plan` — Generate full multi-agent itinerary
- `POST /api/ai/chat` — Conversational AI assistant for trip adjustments
- `POST /api/ai/recommend` — Get ranked recommendations (hotels, places, experiences)
- `POST /api/ai/replan` — Trigger smart replanning due to weather or conflicts

### Places & Maps
- `GET /api/places/search` — Search places by query, destination, category, radius
- `GET /api/places/{id}` — Get place details
- `GET /api/places/along-route` — Search places along a route

### Hotels Engine
- `GET /api/hotels/search` — Search hotels by destination, dates, guests, budget
- `GET /api/hotels/{id}` — Get hotel details
- `GET /api/hotels/{id}/availability` — Check live room availability

### Bookings & Payments
- `POST /api/bookings` — Create a hotel or experience booking
- `GET /api/bookings` — List user bookings
- `GET /api/bookings/{id}` — Get booking details
- `PUT /api/bookings/{id}/cancel` — Cancel booking
- `POST /api/payments/create-order` — Create Razorpay payment order
- `POST /api/payments/verify` — Verify Razorpay checkout payment signature
- `POST /api/payments/webhook` — Razorpay webhook handler

### Local Business Platform
- `POST /api/businesses` — Register business (`PARTNER` role required)
- `GET /api/businesses/{id}` — Get business details
- `PUT /api/businesses/{id}` — Update business details
- `POST /api/businesses/{id}/experiences` — Add experience listing
- `GET /api/businesses/{id}/experiences` — Get experiences listed by business
- `GET /api/businesses/{id}/analytics` — View partner analytics

### Reviews System
- `POST /api/reviews` — Post review (verifies booking completion for "Verified" badge)
- `GET /api/reviews` — List reviews for business or hotel
- `PUT /api/reviews/{id}` — Edit review

### Admin Dashboard (ADMIN role only)
- `GET /api/admin/users` — Manage users
- `PUT /api/admin/users/{id}/status` — Activate/deactivate user account
- `GET /api/admin/businesses` — View businesses pending verification
- `PUT /api/admin/businesses/{id}/verify` — Verify or suspend business
- `GET /api/admin/reviews` — View all reviews for moderation
- `PUT /api/admin/reviews/{id}/moderate` — Approve/hide review
- `GET /api/admin/reports/bookings` — Booking analytics report
- `GET /api/admin/reports/revenue` — Revenue report
