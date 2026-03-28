from app.ml.recommendation_model import recommend_courses_hybrid

class RecommenderService:
    @staticmethod
    def get_recommendations(user_id: str) -> list[str]:
        # Using the hybrid model implementation
        recommended_courses = recommend_courses_hybrid(user_id, top_n=5)
        return recommended_courses
