import os
from typing import Dict, Any, List
from app.providers.open_meteo import OpenMeteoProvider
from app.providers.mock_weather import MockWeatherProvider

class WeatherService:
    def __init__(self):
        provider_name = os.getenv("WEATHER_PROVIDER", "open-meteo").lower()
        if provider_name == "open-meteo":
            self.provider = OpenMeteoProvider()
        else:
            self.provider = MockWeatherProvider()

    async def get_current_weather(self, lat: float, lng: float) -> Dict[str, Any]:
        return await self.provider.get_current_weather(lat, lng)

    async def get_forecast(self, lat: float, lng: float, days: int = 7) -> List[Dict[str, Any]]:
        return await self.provider.get_forecast(lat, lng, days)

    async def get_weather_alerts(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        return await self.provider.get_weather_alerts(lat, lng)
