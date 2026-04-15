from typing import Optional

from fastapi import APIRouter, Query

from app.services.recommender import RecommenderService
from app.schemas.course import CourseRecommendationResponse

router = APIRouter(prefix="/ai/recommend", tags=["Recommendation"])


@router.get("/{userId}", response_model=CourseRecommendationResponse)
def get_recommendations(
    userId: str,
    goal_text: Optional[str] = Query(None, description="Mục tiêu người dùng — ưu tiên khóa cùng danh mục / khớp từ khóa"),
    goal_course_id: Optional[str] = Query(None, description="UUID khóa neo trong catalog (nếu đoán được từ mục tiêu)"),
):
    recommended_courses = RecommenderService.get_recommendations(
        userId,
        goal_text=goal_text,
        goal_course_id=goal_course_id,
    )
    return CourseRecommendationResponse(
        user_id=userId,
        recommended_courses=recommended_courses,
    )
