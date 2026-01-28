from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class RecommendationRequest(BaseModel):
    user_id: str
    progress: float  # Percentage 0-100

class RecommendationResponse(BaseModel):
    recommendation: str
    context: str

@app.post("/recommend", response_model=RecommendationResponse)
def get_recommendation(request: RecommendationRequest):
    # Rule-based logic (MVP)
    
    # 1. Beginner Logic
    if request.progress < 50:
         return {
             "recommendation": "Introduction to Computer Science",
             "context": "Your progress is below 50%. We recommend starting with the basics."
         }
    
    # 2. Intermediate Logic
    if 50 <= request.progress < 80:
        return {
            "recommendation": "Data Structures and Algorithms",
            "context": "You are doing well! It's time to tackle core concepts."
         }
         
    # 3. Advanced Logic
    return {
        "recommendation": "Advanced System Design",
        "context": "You have mastered the basics. Challenge yourself with system design."
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
