import type { CourseDto } from '../services/api';

/**
 * Tìm khóa trong catalog (title/category/description) khớp mục tiêu người dùng nhập.
 * Dùng cho lộ trình AI: gửi `goal_course_id` thật thay vì chỉ `goal_text` (CSV AI thiếu title).
 */
export function findCourseIdMatchingGoal(goal: string, courses: CourseDto[]): string | undefined {
  const q = goal.trim().toLowerCase();
  if (!q || !courses.length) return undefined;

  for (const c of courses) {
    const title = (c.title || '').toLowerCase();
    const cat = (c.category || '').toLowerCase();
    const desc = (c.description || '').toLowerCase();
    const level = (c.level || '').toLowerCase();
    if (title.includes(q) || cat.includes(q) || desc.includes(q) || level.includes(q)) {
      return c.id;
    }
  }

  const words = q.split(/\s+/).filter((w) => w.length > 2);
  if (!words.length) return undefined;

  let best: { id: string; score: number } | undefined;
  for (const c of courses) {
    const blob = `${c.title} ${c.category} ${c.description} ${c.level}`.toLowerCase();
    const score = words.reduce((acc, w) => acc + (blob.includes(w) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { id: c.id, score };
    }
  }
  return best?.id;
}

/** Sắp xếp khóa theo độ khớp mục tiêu — dùng khi gợi ý AI fallback catalog. */
export function rankCoursesByGoal(goal: string, courses: CourseDto[]): CourseDto[] {
  const q = goal.trim().toLowerCase();
  if (!q || !courses.length) return [...courses];

  const scoreOf = (c: CourseDto): number => {
    const blob = `${c.title} ${c.category} ${c.description} ${c.level}`.toLowerCase();
    let s = 0;
    if (blob.includes(q)) s += 10;
    for (const w of q.split(/\s+/).filter((x) => x.length > 2)) {
      if (blob.includes(w)) s += 2;
    }
    return s;
  };

  return [...courses].sort((a, b) => scoreOf(b) - scoreOf(a));
}
