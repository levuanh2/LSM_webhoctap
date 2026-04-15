from typing import Optional

from app.ml.recommendation_model import recommend_courses_hybrid


class RecommenderService:
    @staticmethod
    def get_recommendations(
        user_id: str,
        goal_text: Optional[str] = None,
        goal_course_id: Optional[str] = None,
    ) -> list[str]:
        return recommend_courses_hybrid(
            user_id,
            top_n=5,
            goal_text=(goal_text or "").strip(),
            goal_course_id=(goal_course_id or "").strip(),
        )
