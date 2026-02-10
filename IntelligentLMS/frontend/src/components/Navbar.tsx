// src/components/Navbar.tsx
const Navbar = () => {
  return (
    <header className="h-16 bg-white  border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8">
      {/* Thanh tìm kiếm */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input 
            className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm border-none focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Tìm kiếm bài học, tài liệu..." 
          />
        </div>
      </div>

      {/* Thông báo & Chế độ tối */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <span className="material-symbols-outlined">dark_mode</span>
        </button>
      </div>
    </header>
  );
};

// DÒNG QUAN TRỌNG NHẤT ĐỂ HẾT LỖI:
export default Navbar;