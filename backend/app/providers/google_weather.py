import os
from typing import Dict, Any, List
from app.providers.mock_weather import MockWeatherProvider

class GoogleWeatherProvider:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_WEATHER_API_KEY", "")
        self.demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"
        self.mock_provider = MockWeatherProvider()

    async def get_current_weather(self, lat: float, lng: float) -> Dict[str, Any]:
        if self.demo_mode or not self.api_key:
            return await self.mock_provider.get_current_weather(lat, lng)
        # Production API wrapper logic here...
        return await self.mock_provider.get_current_weather(lat, lng)

    async def get_forecast(self, lat: float, lng: float, days: int = 5) -> List[Dict[str, Any]]:
        if self.demo_mode or not self.api_key:
            return await self.mock_provider.get_forecast(lat, lng, days)
        return await self.mock_provider.get_forecast(lat, lng, days)

    async def get_weather_alerts(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        return await self.mock_provider.get_weather_alerts(lat, lng)
