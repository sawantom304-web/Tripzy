from typing import Optional
from fastapi import APIRouter, Query
from app.services.maps_service import MapsService
from app.schemas.place import PlaceOut
from app.utils.response_utils import success_response

router = APIRouter(prefix="/api/places", tags=["Places & Maps"])
maps_service = MapsService()

@router.get("/search")
async def search_places(
    q: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius: Optional[int] = Query(5000)
):
    places = await maps_service.search_places(
        query=q,
        location=destination,
        category=category,
        radius=radius or 5000
    )
    return success_response(data=places)

@router.get("/along-route")
async def search_along_route(
    origin: str = Query(...),
    destination: str = Query(...),
    category: Optional[str] = Query("food")
):
    route = await maps_service.calculate_route(origin, destination)
    places = await maps_service.search_places(query=category, location=destination)
    return success_response(data={"route": route, "places_along_route": places})

@router.get("/{place_id}")
async def get_place_details(place_id: str):
    place = await maps_service.get_place_details(place_id)
    return success_response(data=place)
