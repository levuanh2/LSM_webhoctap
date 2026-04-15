/** Giá trị lưu DB (tiếng Anh, khớp seed) — label hiển thị tiếng Việt. */
export const COURSE_CATEGORY_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'Backend Development', label: 'Phát triển Backend' },
  { value: 'Frontend Development', label: 'Phát triển Frontend' },
  { value: 'Database', label: 'Cơ sở dữ liệu' },
  { value: 'Security', label: 'Bảo mật' },
  { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
  { value: 'Mobile Development', label: 'Lập trình Mobile' },
  { value: 'Data Science & AI', label: 'Data / AI' },
  { value: 'UI/UX Design', label: 'Thiết kế UI/UX' },
  { value: 'Game Development', label: 'Phát triển game' },
  { value: 'General', label: 'Khác / chung' },
];

export function isPresetCategory(category: string): boolean {
  return COURSE_CATEGORY_OPTIONS.some((o) => o.value === category);
}
