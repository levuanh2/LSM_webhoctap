from pydantic import BaseModel, Field
from typing import Optional

class ReviewStartRequest(BaseModel):
    lesson_id: str
    course_id: str
    # Optional: frontend có thể gửi thẳng nội dung bài để AI tự sinh câu hỏi (không phụ thuộc internal API)
    lesson_title: Optional[str] = None
    lesson_content: Optional[str] = None

class ReviewStartResponse(BaseModel):
    session_id: str
    question: str

class ReviewSubmitRequest(BaseModel):
    session_id: str
    answer: str

class ReviewResponse(BaseModel):
    is_pass: bool = Field(description="Whether the answer passes the criteria based on context")
    feedback: str = Field(description="Detailed feedback to the student")
    score: int = Field(ge=0, le=100, description="Score from 0 to 100")
