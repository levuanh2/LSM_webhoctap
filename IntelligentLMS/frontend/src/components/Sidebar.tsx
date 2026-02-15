import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Nạp linh hồn cho UI

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/user/dashboard', icon: 'dashboard', label: 'Bàn học' },
    { path: '/user/courses', icon: 'menu_book', label: 'Khóa học' },
    { path: '/user/learning-path', icon: 'trending_up', label: 'Lộ trình' },
    { path: '/user/achievements', icon: 'workspace_premium', label: 'Bảng vàng' },
    { path: '/user/profile', icon: 'account_circle', label: 'Cá nhân' },
  ];

  return (
    <motion.aside 
      // Hiệu ứng co giãn có độ nhún (Spring Physics)
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-50 shadow-sm overflow-hidden"
    >
      
      {/* 1. BRANDING: DIEY ACADEMY */}
      <div className={`h-20 flex items-center px-6 mb-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 ring-4 ring-blue-50">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div className="flex flex-col min-w-[120px]">
                <span className="font-black text-gray-800 tracking-tighter text-lg leading-tight uppercase">
                  DIEY <span className="text-blue-600">ACADEMY</span>
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Education Hub</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isCollapsed ? 'last_page' : 'first_page'}
          </span>
        </motion.button>
      </div>

      {/* 2. MENU: Hiệu ứng Hover & Active */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="block relative group">
              <motion.div
                whileHover={{ x: 5 }} // Nhích nhẹ sang phải khi hover
                className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all relative ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" // Đồng bộ chuyển động vạch xanh giữa các tab
                    className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" 
                  />
                )}
                
                <span className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${isActive ? 'fill-1' : ''}`}>
                  {item.icon}
                </span>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`text-sm tracking-tight whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* 3. WIDGET TIẾN ĐỘ: Chuyển động dựa trên dữ liệu thật */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 mx-4 mb-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Mã học viên</p>
              <p className="text-sm font-black mb-3">#DIEY-2026</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }} // Tiến độ hiện tại của Diey
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-white h-full" 
                  />
                </div>
                <span className="text-[10px] font-bold">68%</span>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-6xl opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-700">
              auto_awesome
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;