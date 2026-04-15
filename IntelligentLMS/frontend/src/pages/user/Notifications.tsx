import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_NOTIFICATIONS,
  getReadIds,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from '../../utils/notificationsStore';

const typeIcon = (type: AppNotification['type']) => {
  if (type === 'assignment') return 'edit_note';
  if (type === 'ai') return 'auto_awesome';
  if (type === 'warning') return 'error';
  return 'check_circle';
};

const typeBg = (type: AppNotification['type']) => {
  if (type === 'assignment') return 'bg-orange-50 text-orange-500';
  if (type === 'ai') return 'bg-blue-50 text-blue-600';
  if (type === 'warning') return 'bg-red-50 text-red-500';
  return 'bg-green-50 text-green-500';
};

const Notifications = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [, bump] = useState(0);
  const refresh = useCallback(() => bump((x) => x + 1), []);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener('lms-notifications-changed', onChange);
    return () => window.removeEventListener('lms-notifications-changed', onChange);
  }, [refresh]);

  const list = useMemo(() => {
    const read = getReadIds();
    const all = DEFAULT_NOTIFICATIONS.map((n) => ({ ...n, isRead: read.has(n.id) }));
    if (filter === 'Chưa đọc') return all.filter((n) => !n.isRead);
    if (filter === 'Học tập') return all.filter((n) => n.type === 'assignment' || n.type === 'ai');
    if (filter === 'Hệ thống') return all.filter((n) => n.type === 'system' || n.type === 'warning');
    return all;
  }, [filter, bump]);

  const unreadCount = useMemo(() => {
    const read = getReadIds();
    return DEFAULT_NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
  }, [bump]);

  const categories = ['Tất cả', 'Chưa đọc', 'Học tập', 'Hệ thống'];

  const onMarkRead = (id: string) => {
    markNotificationRead(id);
    refresh();
  };

  const onMarkAll = () => {
    markAllNotificationsRead();
    refresh();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thông báo của bạn</h2>
          <p className="text-sm text-gray-400 mt-1">
            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc.` : 'Không có thông báo mới.'}
          </p>
        </div>
        <button
          type="button"
          disabled={unreadCount === 0}
          onClick={onMarkAll}
          className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 w-fit rounded-2xl flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((notif) => (
          <button
            key={notif.id}
            type="button"
            onClick={() => onMarkRead(notif.id)}
            className={`w-full text-left p-5 rounded-3xl border transition-all flex gap-5 items-start ${
              notif.isRead ? 'bg-white border-gray-50 opacity-80' : 'bg-white border-blue-100 shadow-sm shadow-blue-50'
            } hover:border-blue-200`}
          >
            <div
              className={`size-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${typeBg(notif.type)}`}
            >
              <span className="material-symbols-outlined">{typeIcon(notif.type)}</span>
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h4 className={`text-sm font-bold ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                  {notif.title}
                </h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter shrink-0">
                  {notif.time}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{notif.desc}</p>
            </div>

            {!notif.isRead ? (
              <div className="size-2 bg-blue-600 rounded-full mt-2 ring-4 ring-blue-50 shrink-0" />
            ) : null}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6">Không có thông báo trong mục này.</p>
      ) : null}

      <p className="text-center text-xs text-gray-400 pt-2">
        Thông báo lưu trên trình duyệt (phiên bản demo). Khi có API backend, dữ liệu sẽ đồng bộ tài khoản.
      </p>
    </div>
  );
};

export default Notifications;
