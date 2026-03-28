import os
import pandas as pd
from datetime import datetime
from app.config import settings

def _ensure_csv(filepath: str, columns: list[str]) -> pd.DataFrame:
    if not os.path.exists(filepath):
        df = pd.DataFrame(columns=columns)
        df.to_csv(filepath, index=False)
        return df
    try:
        df = pd.read_csv(filepath)
        # Ensure columns exist, though empty
        for col in columns:
            if col not in df.columns:
                df[col] = None
        return df
    except Exception:
        df = pd.DataFrame(columns=columns)
        return df

def get_interactions_df() -> pd.DataFrame:
    cols = ['user_id', 'course_id', 'rating', 'progress', 'action', 'timestamp']
    return _ensure_csv(settings.INTERACTIONS_CSV, cols)

def get_courses_df() -> pd.DataFrame:
    cols = ['course_id', 'category', 'difficulty', 'rating', 'popularity', 'prerequisite_course_id']
    return _ensure_csv(settings.COURSES_CSV, cols)

def get_progress_df() -> pd.DataFrame:
    cols = ['user_id', 'course_id', 'progress_percentage', 'lessons_completed', 'last_login']
    return _ensure_csv(settings.PROGRESS_CSV, cols)

def upsert_interaction(user_id: str, course_id: str, rating: float = None, progress: float = None, action: str = ""):
    df = get_interactions_df()
    new_row = {
        'user_id': user_id,
        'course_id': course_id,
        'rating': rating,
        'progress': progress,
        'action': action,
        'timestamp': datetime.utcnow().isoformat()
    }
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(settings.INTERACTIONS_CSV, index=False)
    
def upsert_course_popularity(course_id: str, rating_val: float = None):
    # Simply increments popularity or updates rating if provided
    df = get_courses_df()
    if course_id in df['course_id'].values:
        idx = df.index[df['course_id'] == course_id].tolist()[0]
        df.at[idx, 'popularity'] = int(df.at[idx, 'popularity']) + 1 if pd.notna(df.at[idx, 'popularity']) else 1
        if rating_val is not None:
            # simple overwrite or average in real systems
            df.at[idx, 'rating'] = rating_val
    else:
        new_row = {
            'course_id': course_id, 
            'category': 'General', 
            'difficulty': 1, 
            'rating': rating_val if rating_val else 0.0, 
            'popularity': 1,
            'prerequisite_course_id': None
        }
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(settings.COURSES_CSV, index=False)

def upsert_progress(user_id: str, course_id: str, progress: float = None, inc_lesson: bool = False):
    df = get_progress_df()
    
    mask = (df['user_id'] == user_id) & (df['course_id'] == course_id)
    if not df[mask].empty:
        idx = df.index[mask].tolist()[0]
        if progress is not None:
            df.at[idx, 'progress_percentage'] = progress
        if inc_lesson:
            current_lessons = df.at[idx, 'lessons_completed']
            df.at[idx, 'lessons_completed'] = int(current_lessons) + 1 if pd.notna(current_lessons) else 1
        df.at[idx, 'last_login'] = datetime.utcnow().isoformat()
    else:
        new_row = {
            'user_id': user_id,
            'course_id': course_id,
            'progress_percentage': progress if progress else 0.0,
            'lessons_completed': 1 if inc_lesson else 0,
            'last_login': datetime.utcnow().isoformat()
        }
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(settings.PROGRESS_CSV, index=False)
