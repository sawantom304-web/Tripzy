import os
from typing import List, Dict, Any, Optional
from app.providers.booking_com import BookingComProvider

class HotelService:
    def __init__(self):
        self.provider = BookingComProvider()

    async def search_hotels(
        self,
        destination: str,
        check_in: str,
        check_out: str,
        guests: int = 1,
        budget: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        # Redis caching layer can be added if available, otherwise delegates directly
        return await self.provider.search_hotels(destination, check_in, check_out, guests, budget)

    async def get_hotel_details(self, hotel_id: str) -> Optional[Dict[str, Any]]:
        return await self.provider.get_hotel_details(hotel_id)

    async def check_availability(self, hotel_id: str, check_in: str, check_out: str, guests: int) -> Dict[str, Any]:
        return await self.provider.check_availability(hotel_id, check_in, check_out, guests)

    async def create_booking(self, hotel_id: str, check_in: str, check_out: str, guests: int, user_data: dict) -> Dict[str, Any]:
        return await self.provider.create_booking(hotel_id, check_in, check_out, guests, user_data)

    async def cancel_booking(self, booking_reference: str) -> Dict[str, Any]:
        return await self.provider.cancel_booking(booking_reference)
