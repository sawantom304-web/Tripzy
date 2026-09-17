from typing import Dict, Any, List

def calculate_trip_cost(
    hotel_cost: float,
    transport_cost: float,
    food_cost: float,
    activity_cost: float,
    travelers: int = 1
) -> Dict[str, Any]:
    """Calculates total trip cost, per-person cost, and financial breakdown."""
    if travelers < 1:
        travelers = 1
    
    total = hotel_cost + transport_cost + food_cost + activity_cost
    per_person = total / travelers
    
    return {
        "total": round(total, 2),
        "per_person": round(per_person, 2),
        "breakdown": {
            "hotel": round(hotel_cost, 2),
            "transport": round(transport_cost, 2),
            "food": round(food_cost, 2),
            "activity": round(activity_cost, 2)
        }
    }

def calculate_remaining_budget(budget: float, planned_costs: List[float]) -> float:
    """Calculates remaining budget from initial budget and a list of planned costs."""
    return round(budget - sum(planned_costs), 2)

def check_activity_fits_budget(activity_cost: float, remaining_budget: float) -> bool:
    """Checks whether an activity cost fits within the remaining budget."""
    return activity_cost <= remaining_budget
