import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.data.dataset_builder import get_courses_df, get_progress_df

def recommend_courses_hybrid(user_id: str, top_n: int = 5) -> list[str]:
    """
    Hybrid Course Recommendation:
    score = 0.4 * rating + 0.3 * category_similarity + 0.2 * popularity + 0.1 * progress_match
    """
    courses_df = get_courses_df()
    progress_df = get_progress_df()
    
    if courses_df.empty:
        return []

    # Get user progress to find what they are already taking
    user_prog_df = progress_df[progress_df['user_id'] == user_id]
    enrolled_courses = user_prog_df['course_id'].tolist() if not user_prog_df.empty else []
    
    # Filter out courses user already enrolled in (optional based on business logic)
    candidates_df = courses_df[~courses_df['course_id'].isin(enrolled_courses)].copy()
    
    if candidates_df.empty:
        # User took all courses or no candidates
        return []

    # Normalize ratings (0 to 1) for better scoring
    max_rating = candidates_df['rating'].max() if candidates_df['rating'].max() > 0 else 1
    candidates_df['norm_rating'] = candidates_df['rating'] / max_rating
    
    # Normalize popularity
    max_pop = candidates_df['popularity'].max() if candidates_df['popularity'].max() > 0 else 1
    candidates_df['norm_popularity'] = candidates_df['popularity'] / max_pop
    
    # Calculate category similarity
    # Simple check: do they share category with what the user is already taking?
    user_categories = set(courses_df[courses_df['course_id'].isin(enrolled_courses)]['category'].tolist())
    
    def calculate_category_sim(cat):
        if not user_categories:
            return 0.5 # Default to neutral if no history
        return 1.0 if cat in user_categories else 0.0

    candidates_df['category_sim'] = candidates_df['category'].apply(calculate_category_sim)
    
    # Progress Match 
    # E.g. recommend advanced if their avg progress is high, otherwise basics
    avg_prog = user_prog_df['progress_percentage'].mean() if not user_prog_df.empty else 0
    user_level = 1 if avg_prog < 50 else (2 if avg_prog < 80 else 3)
    
    def calculate_difficulty_match(course_level):
        if course_level == user_level: return 1.0
        if abs(course_level - user_level) == 1: return 0.5
        return 0.0
        
    candidates_df['progress_match'] = candidates_df['difficulty'].apply(calculate_difficulty_match)
    
    # Calculate Custom Score Formula
    # score = 0.4 * rating + 0.3 * category_similarity + 0.2 * popularity + 0.1 * progress_match
    candidates_df['hybrid_score'] = (
        0.4 * candidates_df['norm_rating'] +
        0.3 * candidates_df['category_sim'] +
        0.2 * candidates_df['norm_popularity'] +
        0.1 * candidates_df['progress_match']
    )
    
    recommended = candidates_df.sort_values(by='hybrid_score', ascending=False)
    
    return recommended.head(top_n)['course_id'].tolist()
