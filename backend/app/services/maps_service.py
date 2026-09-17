from typing import List, Dict, Any, Optional
from app.providers.google_maps import GoogleMapsProvider

class MapsService:
    def __init__(self):
        self.provider = GoogleMapsProvider()

    async def search_places(
        self,
        query: Optional[str] = None,
        location: Optional[str] = None,
        category: Optional[str] = None,
        radius: int = 5000
    ) -> List[Dict[str, Any]]:
        return await self.provider.search_places(query, location, category, radius)

    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        return await self.provider.get_place_details(place_id)

    async def calculate_route(self, origin: str, destination: str, mode: str = "driving") -> Dict[str, Any]:
        return await self.provider.calculate_route(origin, destination, mode)

    async def calculate_route_matrix(self, locations: List[Dict[str, float]]) -> List[Dict[str, Any]]:
        return await self.provider.calculate_route_matrix(locations)

    async def geocode(self, address: str) -> Dict[str, float]:
        return await self.provider.geocode(address)
