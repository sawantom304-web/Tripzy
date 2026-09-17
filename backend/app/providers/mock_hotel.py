from typing import List, Dict, Any, Optional

MOCK_GOA_HOTELS = [
    {
        "id": "mock_hotel_goa_1",
        "name": "Taj Fort Aguada Resort & Spa",
        "latitude": 15.4920,
        "longitude": 73.7737,
        "rating": 4.8,
        "price_per_night": 14500.0,
        "currency": "INR",
        "amenities": ["Pool", "Beach Access", "Spa", "Free WiFi", "Breakfast Included", "Bar"],
        "photos": ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"],
        "distance_from_city_center": 1.5,
        "cancellation_policy": "free_cancellation"
    },
    {
        "id": "mock_hotel_goa_2",
        "name": "Calangute Beachfront Boutique Resort",
        "latitude": 15.5437,
        "longitude": 73.7553,
        "rating": 4.4,
        "price_per_night": 5200.0,
        "currency": "INR",
        "amenities": ["Pool", "Free WiFi", "Air Conditioning", "Restaurant"],
        "photos": ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"],
        "distance_from_city_center": 0.8,
        "cancellation_policy": "free_cancellation"
    },
    {
        "id": "mock_hotel_goa_3",
        "name": "Anjuna Heritage Villas & Stays",
        "latitude": 15.5872,
        "longitude": 73.7439,
        "rating": 4.3,
        "price_per_night": 3800.0,
        "currency": "INR",
        "amenities": ["Garden", "Free WiFi", "Scooter Rental", "Cafe"],
        "photos": ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"],
        "distance_from_city_center": 2.1,
        "cancellation_policy": "free_cancellation"
    },
    {
        "id": "mock_hotel_goa_4",
        "name": "Panjim Fontainhas Heritage Inn",
        "latitude": 15.4989,
        "longitude": 73.8278,
        "rating": 4.6,
        "price_per_night": 4500.0,
        "currency": "INR",
        "amenities": ["Historic Architecture", "Free Breakfast", "Library", "Free WiFi"],
        "photos": ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"],
        "distance_from_city_center": 0.3,
        "cancellation_policy": "free_cancellation"
    },
    {
        "id": "mock_hotel_goa_5",
        "name": "Palolem Coconut Grove Huts & Spa",
        "latitude": 15.0100,
        "longitude": 74.0231,
        "rating": 4.5,
        "price_per_night": 3200.0,
        "currency": "INR",
        "amenities": ["Eco Huts", "Yoga Deck", "Beachfront", "Vegan Dining"],
        "photos": ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"],
        "distance_from_city_center": 4.5,
        "cancellation_policy": "free_cancellation"
    }
]

class MockHotelProvider:
    async def search_hotels(
        self,
        destination: str,
        check_in: str,
        check_out: str,
        guests: int = 1,
        budget: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        results = MOCK_GOA_HOTELS.copy()
        if budget:
            results = [h for h in results if h["price_per_night"] <= budget]
        return results

    async def get_hotel_details(self, hotel_id: str) -> Optional[Dict[str, Any]]:
        for hotel in MOCK_GOA_HOTELS:
            if hotel["id"] == hotel_id:
                return hotel
        # Fallback to first hotel if ID not matched
        return MOCK_GOA_HOTELS[0]

    async def check_availability(self, hotel_id: str, check_in: str, check_out: str, guests: int) -> Dict[str, Any]:
        return {
            "available": True,
            "hotel_id": hotel_id,
            "rooms_left": 4,
            "rate_per_night": 4500.0,
            "total_price": 9000.0,
            "currency": "INR"
        }

    async def create_booking(self, hotel_id: str, check_in: str, check_out: str, guests: int, user_data: dict) -> Dict[str, Any]:
        return {
            "status": "CONFIRMED",
            "provider_booking_id": f"MOCK-BK-{hotel_id}-8829",
            "hotel_id": hotel_id,
            "check_in": check_in,
            "check_out": check_out,
            "guests": guests
        }

    async def cancel_booking(self, booking_reference: str) -> Dict[str, Any]:
        return {
            "status": "CANCELLED",
            "booking_reference": booking_reference,
            "refund_eligible": True
        }
