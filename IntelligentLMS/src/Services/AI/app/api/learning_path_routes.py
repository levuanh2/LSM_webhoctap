from typing import Optional

from fastapi import APIRouter, Query

from app.data.dataset_builder import get_courses_df
from app.schemas.course import LearningPathResponse
from app.services.learning_path import LearningPathService

router = APIRouter(prefix="/ai/learning-path", tags=["Learning Path"])


def _row_popularity(row) -> int:
    try:
        return int(float(row.get("popularity") or 0))
    except (TypeError, ValueError):
        return 0


def _resolve_goal_course_id_from_text(goal_text: str) -> Optional[str]:
    """Khớp mục tiêu tự nhập với category / course_id trong CSV khóa học của AI."""
    df = get_courses_df()
    if df.empty or not goal_text.strip():
        return None
    t = goal_text.strip().lower()
    candidates: list[tuple[str, int]] = []
    for _, row in df.iterrows():
        cid = str(row.get("course_id") or "").strip()
        if not cid:
            continue
        cat = str(row.get("category") or "").lower()
        cid_l = cid.lower()
        pop = _row_popularity(row)
        if t == cid_l or t in cat or t in cid_l:
            candidates.append((cid, pop))
    if not candidates:
        for _, row in df.iterrows():
            cid = str(row.get("course_id") or "").strip()
            if not cid:
                continue
            cat = str(row.get("category") or "").lower()
            cid_l = cid.lower()
            pop = _row_popularity(row)
            for word in t.split():
                if len(word) > 2 and (word in cat or word in cid_l):
                    candidates.append((cid, pop))
                    break
    if not candidates:
        return None
    candidates.sort(key=lambda x: -x[1])
    return candidates[0][0]


@router.get("", response_model=LearningPathResponse)
def get_learning_path(
    goal_course_id: Optional[str] = Query(None, description="UUID khóa mục tiêu (nếu đã biết)"),
    goal_text: Optional[str] = Query(None, description="Mục tiêu dạng chữ — khớp category/course_id"),
    user_id: Optional[str] = Query(None, description="User (dự phòng mở rộng)"),
):
    """
    Frontend gửi `goal_text` + `user_id`. Nếu có `goal_course_id` thì ưu tiên.
    Trước đây chỉ có `goal_course_id` bắt buộc → thiếu param gây 422.
    """
    _ = user_id  # reserved

    resolved = (goal_course_id or "").strip() or None
    if not resolved and goal_text and goal_text.strip():
        resolved = _resolve_goal_course_id_from_text(goal_text)
        if not resolved:
            return LearningPathResponse(
                goal_course_id="",
                path=[],
                message=(
                    "Chưa khớp được khóa mục tiêu từ mô tả — hãy thử từ khối gần với "
                    "tên khóa hoặc danh mục trên hệ thống, hoặc chọn khóa trong trang Khóa học rồi tạo lại lộ trình."
                ),
            )

    if not resolved:
        return LearningPathResponse(
            goal_course_id="",
            path=[],
            message="Nhập mục tiêu (goal_text) hoặc goal_course_id.",
        )

    path, reason = LearningPathService.generate_path(resolved)

    if reason == "empty_graph":
        return LearningPathResponse(
            goal_course_id=resolved,
            path=[],
            message=(
                "Chưa có dữ liệu prerequisite trong phần AI — thử lộ trình theo danh mục/cấp độ "
                "trên hệ thống (đã ưu tiên trước khi gọi AI) hoặc bổ sung file khóa học đồng bộ."
            ),
        )

    if reason == "cycle":
        return LearningPathResponse(
            goal_course_id=resolved,
            path=[],
            message=(
                "Dữ liệu prerequisite tạo vòng (A cần B, B lại cần A) nên không xếp được thứ tự. "
                "Hãy chỉnh prerequisite trong nguồn dữ liệu hoặc dùng lộ trình theo danh mục trên máy chủ Khóa học."
            ),
        )

    if reason == "not_in_graph":
        return LearningPathResponse(
            goal_course_id=resolved,
            path=path,
            message=(
                "Khóa mục tiêu chưa có trong đồ thị prerequisite của AI (mã khóa catalog thường khác "
                "course_id trong file đồng bộ). Đang hiển thị đúng khóa bạn chọn — để có chuỗi khóa đầy đủ, "
                "hãy dùng lộ trình theo danh mục và cấp độ từ trang Khóa học."
            ),
        )

    return LearningPathResponse(
        goal_course_id=resolved,
        path=path,
        message="Đã dựng lộ trình theo prerequisite trong dữ liệu AI.",
    )
