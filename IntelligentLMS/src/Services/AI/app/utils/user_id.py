"""Chuẩn hóa user_id / course_id khi so khớp CSV (Kafka có thể khác định dạng GUID)."""


def norm_id(value) -> str:
    s = str(value or "").strip().lower()
    return s.replace("-", "")
