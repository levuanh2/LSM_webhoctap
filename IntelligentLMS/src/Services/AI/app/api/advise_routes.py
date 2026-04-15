import json
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.ollama_provider import OllamaProvider
from app.utils.logger import logger

router = APIRouter(prefix="/ai/advise", tags=["Advisor"])


class CourseBrief(BaseModel):
    id: str
    title: str = ""
    category: str = ""
    level: str = ""
    description: str = ""


class AdviseCoursesRequest(BaseModel):
    user_id: str = Field(..., description="Người học")
    goal_text: Optional[str] = None
    courses: list[CourseBrief] = Field(default_factory=list)


class AdviseCoursesResponse(BaseModel):
    message: str = ""
    recommended_ids: list[str] = Field(default_factory=list)


@router.post("/courses", response_model=AdviseCoursesResponse)
async def advise_courses(body: AdviseCoursesRequest):
    """
    Trợ lý Ollama: đọc catalog thật do frontend gửi, trả lời tiếng Việt + thứ tự id gợi ý.
    Không phụ thuộc Kafka/CSV.
    """
    if not body.courses:
        return AdviseCoursesResponse(
            message="Chưa có khóa học trong danh mục để phân tích.",
            recommended_ids=[],
        )

    brief = [
        {
            "id": c.id,
            "title": c.title,
            "category": c.category,
            "level": c.level,
        }
        for c in body.courses[:48]
    ]
    goal = (body.goal_text or "").strip() or "học tập và phát triển kỹ năng"

    prompt = f"""Bạn là cố vấn học tập IntelligentLMS, thân thiện và thực tế.
Người học có MỤC TIÊU: "{goal}".

Danh sách khóa học có trên hệ thống (JSON):
{json.dumps(brief, ensure_ascii=False)}

Nhiệm vụ:
1) Chọn tối đa 6 khóa phù hợp nhất với mục tiêu (ưu tiên đúng chủ đề, trình độ hợp lý).
2) Viết "message" 2–4 câu tiếng Việt: gợi ý lộ trình ngắn, khích lệ, KHÔNG nhắc Kafka, CSV hay kỹ thuật nội bộ.

Trả về ĐÚNG một JSON (không markdown):
{{"message": "...", "recommended_ids": ["uuid", ...]}}
Chỉ dùng id có trong danh sách trên. Nếu khó khăn, vẫn trả message an toàn và recommended_ids có thể rỗng."""

    try:
        raw = await OllamaProvider.generate_response(prompt, json_format=True)
        data = json.loads(raw) if raw else {}
        msg = str(data.get("message", "") or "").strip()
        ids = data.get("recommended_ids") or data.get("priority_course_ids") or []
        if not isinstance(ids, list):
            ids = []
        valid = {c.id for c in body.courses}
        filtered = [str(i) for i in ids if str(i) in valid][:8]
        return AdviseCoursesResponse(message=msg, recommended_ids=filtered)
    except Exception as e:
        logger.warning(f"Advise Ollama fallback: {e}")
        return AdviseCoursesResponse(
            message="",
            recommended_ids=[],
        )
