import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  path: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: 'dashboard', label: 'Tổng quan', path: '/user/dashboard' },
  { icon: 'book_4', label: 'Khóa học của tôi', path: '/user/courses', badge: '12' },
  { icon: 'auto_awesome', label: 'Lộ trình AI', path: '/user/learning-path' },
  { icon: 'trophy', label: 'Thành tích', path: '/user/achievements', badge: '3' },
  { icon: 'person', label: 'Hồ sơ', path: '/user/profile' },
];

const Sidebar = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm relative">
      
      {/* Logo Section - Xanh Blue chủ đạo */}
      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200 transition-transform hover:scale-105">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">
            LMS <span className="text-blue-600">Platform</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Intelligent Learning</p>
        </div>
      </div>

      {/* Stats Card - Chuyển sang tông xanh dương dương nồng nàn */}
      <div className="mx-6 mb-6 p-5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium opacity-90">Tiến độ học tập</span>
            <span className="material-symbols-outlined text-lg">trending_up</span>
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-3xl font-bold">68</span>
            <span className="text-sm opacity-75">%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>

      {/* Navigation - Trắng sạch, Hover xanh nhạt */}
      <nav className="flex-1 px-4 space-y-1 relative z-10 overflow-y-auto custom-scrollbar">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3">
          Menu chính
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              className="block group"
            >
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}>
                <span className={`material-symbols-outlined text-xl transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                }`}>
                  {item.icon}
                </span>
                <span className={`font-semibold text-sm flex-1 ${isActive ? 'text-blue-600' : ''}`}>
                  {item.label}
                </span>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                
                {/* Active Indicator */}
                {isActive && (
                   <div className="absolute right-0 w-1 h-6 bg-blue-600 rounded-l-full"></div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile - Nền xám cực nhẹ */}
      <div className="p-6 border-t border-gray-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all group">
          <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            NV
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-gray-800">Nguyễn Văn A</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">Học viên Premium</p>
          </div>
          <button className="text-gray-300 hover:text-blue-600 transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-all font-semibold text-xs group">
          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Scrollbar Xanh Blue nhạt */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bfdbfe; }
      `}</style>
    </aside>
  );
};

export default Sidebar;