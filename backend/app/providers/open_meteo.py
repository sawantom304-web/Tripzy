import os
import httpx
from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta

class OpenMeteoProvider:
    """Real weather provider using the free Open-Meteo API (no API key needed)."""

    def __init__(self):
        self.base_url = os.getenv("OPEN_METEO_BASE_URL", "https://api.open-meteo.com/v1/forecast")

    async def get_current_weather(self, lat: float, lng: float) -> Dict[str, Any]:
        """Fetch current weather conditions from Open-Meteo."""
        params = {
            "latitude": lat,
            "longitude": lng,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m",
            "timezone": "auto"
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.base_url, params=params)
                resp.raise_for_status()
                data = resp.json()

            current = data.get("current", {})
            weather_code = current.get("weather_code", 0)

            return {
                "temperature": current.get("temperature_2m", 0),
                "feels_like": current.get("apparent_temperature", 0),
                "rain_probability": self._rain_prob_from_code(weather_code),
                "condition": self._condition_from_code(weather_code),
                "wind_speed": current.get("wind_speed_10m", 0),
                "humidity": current.get("relative_humidity_2m", 0),
                "precipitation_mm": current.get("precipitation", 0),
                "weather_code": weather_code,
                "timestamp": current.get("time", datetime.now(timezone.utc).isoformat())
            }
        except Exception as e:
            print(f"[Open-Meteo] Current weather fetch error: {e}")
            return self._fallback_current()

    async def get_forecast(self, lat: float, lng: float, days: int = 7) -> List[Dict[str, Any]]:
        """Fetch multi-day weather forecast from Open-Meteo."""
        params = {
            "latitude": lat,
            "longitude": lng,
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code,wind_speed_10m_max",
            "timezone": "auto",
            "forecast_days": min(days, 16)
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(self.base_url, params=params)
                resp.raise_for_status()
                data = resp.json()

            daily = data.get("daily", {})
            dates = daily.get("time", [])
            temp_max = daily.get("temperature_2m_max", [])
            temp_min = daily.get("temperature_2m_min", [])
            rain_prob = daily.get("precipitation_probability_max", [])
            precip = daily.get("precipitation_sum", [])
            codes = daily.get("weather_code", [])
            wind = daily.get("wind_speed_10m_max", [])

            forecasts = []
            for i in range(len(dates)):
                code = codes[i] if i < len(codes) else 0
                forecasts.append({
                    "date": dates[i],
                    "temp_max": temp_max[i] if i < len(temp_max) else 30.0,
                    "temp_min": temp_min[i] if i < len(temp_min) else 24.0,
                    "rain_probability": rain_prob[i] if i < len(rain_prob) else 0,
                    "precipitation_mm": precip[i] if i < len(precip) else 0,
                    "condition": self._condition_from_code(code),
                    "weather_code": code,
                    "wind_speed": wind[i] if i < len(wind) else 10.0
                })
            return forecasts
        except Exception as e:
            print(f"[Open-Meteo] Forecast fetch error: {e}")
            return self._fallback_forecast(days)

    async def get_weather_alerts(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        """Check forecast for high rain probability and generate alerts."""
        forecasts = await self.get_forecast(lat, lng, days=5)
        alerts = []
        for f in forecasts:
            if f.get("rain_probability", 0) >= 70:
                alerts.append({
                    "alert_id": f"ALERT-RAIN-{f['date']}",
                    "severity": "WARNING",
                    "event": f"Heavy Rain Expected on {f['date']}",
                    "rain_probability": f["rain_probability"],
                    "precipitation_mm": f.get("precipitation_mm", 0),
                    "start_time": f"{f['date']}T12:00:00",
                    "end_time": f"{f['date']}T18:00:00",
                    "recommendation": "Consider indoor activities during peak rain hours. AI replanning available."
                })
        return alerts

    @staticmethod
    def _condition_from_code(code: int) -> str:
        """Map WMO weather interpretation code to human-readable condition."""
        wmo_map = {
            0: "Clear Sky",
            1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
            45: "Foggy", 48: "Depositing Rime Fog",
            51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
            56: "Freezing Drizzle", 57: "Heavy Freezing Drizzle",
            61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
            66: "Freezing Rain", 67: "Heavy Freezing Rain",
            71: "Slight Snow", 73: "Moderate Snow", 75: "Heavy Snow",
            77: "Snow Grains",
            80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
            85: "Slight Snow Showers", 86: "Heavy Snow Showers",
            95: "Thunderstorm", 96: "Thunderstorm with Slight Hail", 99: "Thunderstorm with Heavy Hail"
        }
        return wmo_map.get(code, "Unknown")

    @staticmethod
    def _rain_prob_from_code(code: int) -> float:
        """Estimate rain probability from WMO weather code."""
        if code in (61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99):
            return 85.0
        elif code in (51, 53, 55, 56, 57):
            return 50.0
        elif code in (3, 45, 48):
            return 25.0
        elif code in (1, 2):
            return 10.0
        return 5.0

    @staticmethod
    def _fallback_current():
        return {
            "temperature": 29.0,
            "feels_like": 32.0,
            "rain_probability": 15.0,
            "condition": "Partly Cloudy",
            "wind_speed": 12.0,
            "humidity": 70,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    @staticmethod
    def _fallback_forecast(days: int):
        base_date = datetime.now(timezone.utc)
        return [
            {
                "date": (base_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                "temp_max": 31.0,
                "temp_min": 24.0,
                "rain_probability": 15.0,
                "condition": "Partly Cloudy",
                "wind_speed": 10.0
            }
            for i in range(days)
        ]
