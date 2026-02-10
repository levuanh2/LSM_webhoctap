import { Link } from 'react-router-dom';
import { useState } from 'react';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');

  // Dữ liệu khóa học dựa trên đề tài nghiên cứu của Diey
  const courses = [
    { id: 'game-engine', title: "Lập trình C++ cho Game Engine", progress: 85, tag: "Game Dev", lessons: "12/15 bài" },
    { id: 'malware-detection', title: "Phát hiện mã độc & Phân tích PE", progress: 68, tag: "Cyber Security", lessons: "8/12 bài" },
    { id: 'flutter-mobile', title: "Phát triển Web với Flutter & Dart", progress: 10, tag: "Mobile", lessons: "2/20 bài" },
    { id: 'machine-learning', title: "Machine Learning cơ bản", progress: 40, tag: "AI/ML", lessons: "4/10 bài" },
  ];

  const tabs = ['Tất cả', 'Đang học', 'Hoàn thành'];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Bộ lọc Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Khóa học của tôi</h2>
          <p className="text-sm text-gray-400 mt-1">Chào Diey, bạn có {courses.length} khóa học cần hoàn thành.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Danh sách Khóa học */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/user/lesson/${course.id}`} // Click để sang trang xem video
            className="group bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden"
          >
            {/* Hình ảnh đại diện với Icon động */}
            <div className="h-44 bg-blue-50 rounded-2xl mb-5 flex items-center justify-center text-blue-200 relative overflow-hidden">
               <span className="material-symbols-outlined text-5xl group-hover:scale-110 transition-transform duration-500">
                {course.tag === "Game Dev" ? "videogame_asset" :
                 course.tag === "Cyber Security" ? "security" : "code"}
               </span>
               <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                  {course.tag}
                </span>
                <span className="text-[10px] font-bold text-gray-400">{course.lessons}</span>
              </div>

              <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 h-10">
                {course.title}
              </h4>

              {/* Thanh tiến độ học tập */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Tiến độ</span>
                  <span className="text-[10px] font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                   <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${course.progress}%` }}
                   />
                </div>
              </div>

              {/* Nút học tiếp chỉ hiện khi hover */}
              <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                  Vào học ngay <span className="material-symbols-outlined text-sm">play_arrow</span>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;