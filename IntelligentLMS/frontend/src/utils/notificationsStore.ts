/** Thông báo trong app (chưa có API backend — lưu trạng thái đã đọc ở localStorage). */

export type NotificationType = 'assignment' | 'ai' | 'system' | 'warning';

export type AppNotification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: NotificationType;
};

const STORAGE_READ_IDS = 'lms-notification-read-ids';

export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Nhắc học nhẹ',
    desc: 'Bạn có khóa đang học dở — vào xem vài phút cũng được nhé.',
    time: 'Gần đây',
    type: 'assignment',
  },
  {
    id: 'n2',
    title: 'Gợi ý từ AI',
    desc: 'Trung tâm AI có lộ trình và gợi ý khóa mới theo mục tiêu của bạn.',
    time: 'Hôm nay',
    type: 'ai',
  },
  {
    id: 'n3',
    title: 'Chào mừng đến IntelligentLMS',
    desc: 'Khám phá khóa học, theo dõi tiến độ và nhịp học trong mục AI.',
    time: 'Hệ thống',
    type: 'system',
  },
];

function parseReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_READ_IDS);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_READ_IDS, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent('lms-notifications-changed'));
}

export function getReadIds(): Set<string> {
  return parseReadIds();
}

export function isNotificationRead(id: string): boolean {
  return parseReadIds().has(id);
}

export function markNotificationRead(id: string) {
  const s = parseReadIds();
  s.add(id);
  saveReadIds(s);
}

export function markAllNotificationsRead() {
  const s = new Set(DEFAULT_NOTIFICATIONS.map((n) => n.id));
  saveReadIds(s);
}

export function getUnreadNotificationCount(): number {
  const read = parseReadIds();
  return DEFAULT_NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
}
