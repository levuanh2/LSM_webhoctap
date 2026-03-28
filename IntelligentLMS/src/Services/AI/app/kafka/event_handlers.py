import json
from app.data.dataset_builder import upsert_interaction, upsert_progress, upsert_course_popularity

def handle_user_registered(msg_data: dict):
    # Depending on message content, initialize basic user footprint
    # Or just log an empty interaction for tracking
    pass

def handle_course_enrolled(msg_data: dict):
    user_id = str(msg_data.get('userId'))
    course_id = str(msg_data.get('courseId'))
    upsert_interaction(user_id, course_id, action='enrolled')
    upsert_progress(user_id, course_id, progress=0.0, inc_lesson=False)
    upsert_course_popularity(course_id)

def handle_lesson_completed(msg_data: dict):
    user_id = str(msg_data.get('userId'))
    course_id = str(msg_data.get('courseId'))
    # Assume payload has an updated 'progress' field or it's handled via logic
    progress = msg_data.get('progress') 
    upsert_interaction(user_id, course_id, action='completed_lesson')
    upsert_progress(user_id, course_id, progress=progress, inc_lesson=True)

def handle_progress_updated(msg_data: dict):
    user_id = str(msg_data.get('userId'))
    course_id = str(msg_data.get('courseId'))
    progress = msg_data.get('progress')
    upsert_interaction(user_id, course_id, progress=progress, action='updated_progress')
    upsert_progress(user_id, course_id, progress=progress)

def handle_course_rated(msg_data: dict):
    user_id = str(msg_data.get('userId'))
    course_id = str(msg_data.get('courseId'))
    rating = msg_data.get('rating')
    upsert_interaction(user_id, course_id, rating=rating, action='rated')
    upsert_course_popularity(course_id, rating_val=rating)

# Dispatcher
EVENT_DISPATCH = {
    "user-registered": handle_user_registered,
    "course-enrolled": handle_course_enrolled,
    "lesson-completed": handle_lesson_completed,
    "progress-updated": handle_progress_updated,
    "course-rated": handle_course_rated
}

def process_message(topic: str, value: str):
    """
    Parse JSON from kafka message and route to handlers
    """
    try:
        data = json.loads(value)
        handler = EVENT_DISPATCH.get(topic)
        if handler:
            handler(data)
            print(f"Processed event for {topic}: {data}")
        else:
            print(f"No handler for topic {topic}")
    except json.JSONDecodeError:
        print(f"Failed to decode message: {value}")
    except Exception as e:
        print(f"Error processing message from {topic}: {e}")
