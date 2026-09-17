import os
from typing import List, Dict, Any, Optional
import httpx

MOCK_PLACES_GOA = [
    {
        "id": "place_baga_beach_goa",
        "name": "Baga Beach",
        "latitude": 15.5553,
        "longitude": 73.7517,
        "address": "Baga, Calangute, Goa 403516",
        "rating": 4.6,
        "category": "beach",
        "opening_hours": {"open_now": True, "periods": "24/7"},
        "photos": ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"],
        "price_level": 1
    },
    {
        "id": "place_aguada_fort_goa",
        "name": "Fort Aguada",
        "latitude": 15.4920,
        "longitude": 73.7737,
        "address": "Sinquerim, Candolim, Goa 403515",
        "rating": 4.5,
        "category": "sightseeing",
        "opening_hours": {"open_now": True, "periods": "09:30 AM - 06:00 PM"},
        "photos": ["https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80"],
        "price_level": 1
    },
    {
        "id": "place_fontainhas_goa",
        "name": "Fontainhas Latin Quarter",
        "latitude": 15.4989,
        "longitude": 73.8278,
        "address": "Panaji, Goa 403001",
        "rating": 4.7,
        "category": "culture",
        "opening_hours": {"open_now": True, "periods": "24/7"},
        "photos": ["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"],
        "price_level": 1
    },
    {
        "id": "place_dudhsagar_falls",
        "name": "Dudhsagar Waterfalls",
        "latitude": 15.3144,
        "longitude": 74.3143,
        "address": "Sonaulim, Goa 403410",
        "rating": 4.8,
        "category": "nature",
        "opening_hours": {"open_now": True, "periods": "06:00 AM - 05:00 PM"},
        "photos": ["https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"],
        "price_level": 2
    },
    {
        "id": "place_fisherman_wharf",
        "name": "The Fisherman's Wharf",
        "latitude": 15.1554,
        "longitude": 73.9458,
        "address": "Mobor, Cavelossim, Goa 403731",
        "rating": 4.6,
        "category": "food",
        "opening_hours": {"open_now": True, "periods": "12:00 PM - 11:00 PM"},
        "photos": ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"],
        "price_level": 3
    }
]

class GoogleMapsProvider:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_SERVER_KEY", "")
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"

    async def search_places(
        self,
        query: Optional[str] = None,
        location: Optional[str] = None,
        category: Optional[str] = None,
        radius: int = 5000
    ) -> List[Dict[str, Any]]:
        if self.demo_mode or not self.api_key:
            results = MOCK_PLACES_GOA.copy()
            if category:
                matched = [p for p in results if p["category"].lower() == category.lower()]
                if matched:
                    return matched
            return results

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(
                    "https://maps.googleapis.com/maps/api/place/textsearch/json",
                    params={
                        "query": f"{query or ''} {location or ''}".strip(),
                        "key": self.api_key
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    places = []
                    for item in data.get("results", []):
                        loc = item.get("geometry", {}).get("location", {})
                        places.append({
                            "id": item.get("place_id"),
                            "name": item.get("name"),
                            "latitude": loc.get("lat", 0.0),
                            "longitude": loc.get("lng", 0.0),
                            "address": item.get("formatted_address"),
                            "rating": item.get("rating", 4.0),
                            "category": category or "attraction",
                            "opening_hours": item.get("opening_hours", {}),
                            "photos": [],
                            "price_level": item.get("price_level", 2)
                        })
                    return places if places else MOCK_PLACES_GOA
        except Exception:
            pass
        return MOCK_PLACES_GOA

    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        for place in MOCK_PLACES_GOA:
            if place["id"] == place_id:
                return place
        return MOCK_PLACES_GOA[0]

    async def calculate_route(self, origin: str, destination: str, mode: str = "driving") -> Dict[str, Any]:
        return {
            "origin": origin,
            "destination": destination,
            "mode": mode,
            "distance": "18.5 km",
            "duration": "35 mins",
            "polyline": "encoded_polyline_sample_data"
        }

    async def calculate_route_matrix(self, locations: List[Dict[str, float]]) -> List[Dict[str, Any]]:
        return [{"from_index": 0, "to_index": 1, "distance_km": 5.2, "duration_min": 12}]

    async def geocode(self, address: str) -> Dict[str, float]:
        return {"latitude": 15.4989, "longitude": 73.8278}
