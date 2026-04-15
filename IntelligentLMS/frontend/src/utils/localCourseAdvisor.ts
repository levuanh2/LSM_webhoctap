import type { CourseDto, CourseProgressResponse } from '../services/api';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function tokenize(goal: string): string[] {
  return norm(goal)
    .split(/[\s,;.]+/)
    .filter((w) => w.length > 1);
}

/**
 * Gợi ý khóa dựa trên dữ liệu thật (catalog + tiến độ) — không phụ thuộc CSV AI/Kafka.
 */
export function buildSmartRecommendations(
  courses: CourseDto[],
  progressByCourseId: Record<string, CourseProgressResponse | undefined>,
  opts: {
    goalText?: string;
    goalCourseId?: string;
    limit: number;
  }
): CourseDto[] {
  const { goalText, goalCourseId, limit } = opts;
  const goal = (goalText || '').trim();
  const tokens = tokenize(goal);
  const gid = (goalCourseId || '').trim().toLowerCase();

  const categoriesWithActivity = new Set<string>();
  for (const c of courses) {
    const p = progressByCourseId[c.id];
    const pct = p?.progressPercentage ?? 0;
    if (pct > 0 && pct < 100 && c.category) categoriesWithActivity.add(norm(c.category));
  }

  const scored = courses
    .map((c) => {
      const p = progressByCourseId[c.id];
      const pct = p?.progressPercentage ?? 0;
      let score = 0;

      if (pct >= 100) score -= 200;

      if (gid && norm(c.id) === gid) score += 120;

      const blob = `${c.title} ${c.category} ${c.description} ${c.level}`.toLowerCase();
      if (goal) {
        if (blob.includes(norm(goal))) score += 80;
        for (const t of tokens) {
          if (t.length > 2 && blob.includes(t)) score += 25;
        }
      }

      if (pct > 0 && pct < 100) score += 45;

      if (c.category && categoriesWithActivity.has(norm(c.category))) score += 20;

      const lvl = (c.level || '').toLowerCase();
      if (lvl.includes('beginner')) score += 5;
      if (lvl.includes('intermediate')) score += 8;
      if (lvl.includes('advanced')) score += 10;

      return { c, score };
    })
    .filter((x) => x.score > -100)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);

  const seen = new Set<string>();
  const out: CourseDto[] = [];
  for (const c of scored) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
    if (out.length >= limit) break;
  }

  if (out.length < limit) {
    for (const c of courses) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      out.push(c);
      if (out.length >= limit) break;
    }
  }

  return out.slice(0, limit);
}
