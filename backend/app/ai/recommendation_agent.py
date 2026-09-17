from typing import List, Dict, Any

class RecommendationAgent:
    async def rank_items(
        self,
        items: List[Dict[str, Any]],
        user_interests: List[str],
        max_budget: float = 100000.0
    ) -> List[Dict[str, Any]]:
        """Ranks recommendations based on match score, rating, and budget fit."""
        scored_items = []
        for item in items:
            rating = item.get("rating", 4.0)
            cost = item.get("price_per_night", item.get("price_level", 2) * 500.0)
            
            # Score formula: Rating (0-5) * 20 + Budget fit bonus
            score = rating * 20.0
            if cost <= max_budget:
                score += 15.0
            else:
                score -= 10.0

            scored_item = item.copy()
            scored_item["match_score"] = min(round(score, 1), 99.0)
            scored_items.append(scored_item)

        scored_items.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_items
