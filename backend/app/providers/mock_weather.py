from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta

class MockWeatherProvider:
    async def get_current_weather(self, lat: float, lng: float) -> Dict[str, Any]:
        return {
            "temperature": 29.5,
            "feels_like": 32.0,
            "rain_probability": 15.0, # 15% rain
            "condition": "Partly Cloudy",
            "wind_speed": 12.5,
            "humidity": 75,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    async def get_forecast(self, lat: float, lng: float, days: int = 5) -> List[Dict[str, Any]]:
        forecasts = []
        base_date = datetime.now(timezone.utc)
        
        # Simulate day 2 having high rain probability for automated replanning tests
        rain_probs = [15.0, 85.0, 20.0, 10.0, 30.0, 40.0, 15.0]
        conditions = ["Sunny", "Heavy Rain", "Partly Cloudy", "Clear", "Scattered Showers", "Sunny", "Clear"]
        
        for i in range(min(days, 7)):
            d = base_date + timedelta(days=i)
            forecasts.append({
                "date": d.strftime("%Y-%m-%d"),
                "temp_max": 31.0 - (i % 2),
                "temp_min": 24.0,
                "rain_probability": rain_probs[i],
                "condition": conditions[i],
                "wind_speed": 10.0 + i
            })
        return forecasts

    async def get_weather_alerts(self, lat: float, lng: float) -> List[Dict[str, Any]]:
        return [
            {
                "alert_id": "ALERT-RAIN-89",
                "severity": "WARNING",
                "event": "Heavy Monsoon Shower Expected",
                "rain_probability": 85.0,
                "start_time": (datetime.now(timezone.utc) + timedelta(days=1, hours=2)).isoformat(),
                "end_time": (datetime.now(timezone.utc) + timedelta(days=1, hours=6)).isoformat(),
                "recommendation": "Avoid outdoor beaches and watersports during shower hours."
            }
        ]
