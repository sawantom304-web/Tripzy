from typing import Optional
from fastapi import APIRouter, Query
from app.services.hotel_service import HotelService
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/hotels", tags=["Hotels Engine"])
hotel_service = HotelService()

@router.get("/search")
async def search_hotels(
    destination: str = Query(...),
    check_in: str = Query(...),
    check_out: str = Query(...),
    guests: int = Query(1),
    budget: Optional[float] = Query(None)
):
    hotels = await hotel_service.search_hotels(
        destination=destination,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        budget=budget
    )
    return success_response(data=hotels)

@router.get("/{hotel_id}")
async def get_hotel_details(hotel_id: str):
    hotel = await hotel_service.get_hotel_details(hotel_id)
    return success_response(data=hotel)

@router.get("/{hotel_id}/availability")
async def check_hotel_availability(
    hotel_id: str,
    check_in: str = Query(...),
    check_out: str = Query(...),
    guests: int = Query(1)
):
    avail = await hotel_service.check_availability(hotel_id, check_in, check_out, guests)
    return success_response(data=avail)
