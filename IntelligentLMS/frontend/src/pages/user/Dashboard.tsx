import { Link } from 'react-router-dom';
const Dashboard = () => {
  return (
    <div className="p-8 max-w-[1440px] mx-auto flex gap-8 flex-col xl:flex-row">
      
      {/* CỘT TRÁI: Nội dung chính học tập */}
      <div className="flex-1 space-y-8">
        
        {/* 1. Lời chào & Khóa học đang học */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Chào mừng bạn trở lại, Diey!</h2>
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            {/* Ảnh khóa học */}
            <div className="w-full md:w-64 h-48 bg-gray-100 rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-all"></div>
              {/* Chèn ảnh ReactJS hoặc Game Engine của bạn ở đây */}
              <div className="w-full h-full flex items-center justify-center text-blue-200">
                 <span className="material-symbols-outlined text-6xl">code</span>
              </div>
            </div>

            {/* Thông tin tiến độ */}
            <div className="flex-1 w-full">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">ĐANG HỌC</span>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">Phát triển Game Engine cơ bản</h3>
              <p className="text-sm text-gray-400 mt-1">Bài tiếp theo: Tối ưu hóa bộ nhớ & Quản lý tài nguyên</p>
              
              <div className="mt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700">75% <span className="text-gray-400 font-medium">Tiến độ</span></span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>

              <Link 
  to="/user/lesson/1" 
  className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 w-fit"
>
  Học tiếp <span className="material-symbols-outlined">play_circle</span>
</Link>
            </div>
          </div>
        </section>

        {/* 2. Gợi ý từ AI (AI Suggestions) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Gợi ý từ AI</h3>
            <button className="text-sm text-blue-600 font-bold hover:underline">Xem tất cả</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thẻ gợi ý 1 */}
            <div className="bg-white p-4 rounded-2xl border border-gray-50 flex gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0"></div>
              <div>
                <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span> AI ĐỀ XUẤT
                </span>
                <h4 className="font-bold text-gray-800 text-sm mt-1">Phân tích đặc trưng tĩnh tập tin PE</h4>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">Bổ trợ cho đề tài Học máy & Mã độc của bạn</p>
              </div>
            </div>

            {/* Thẻ gợi ý 2 */}
            <div className="bg-white p-4 rounded-2xl border border-gray-50 flex gap-4 hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0"></div>
              <div>
                <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span> AI ĐỀ XUẤT
                </span>
                <h4 className="font-bold text-gray-800 text-sm mt-1">Flutter & Dart Nâng cao</h4>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">Dựa trên sở thích lập trình Mobile của bạn</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CỘT PHẢI: Thống kê & Thành tích */}
      <div className="w-full xl:w-80 space-y-6">
        
        {/* 1. Biểu đồ hoạt động */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-blue-600">bar_chart</span> Hoạt động hàng tuần
          </h4>
          {/* Giả lập biểu đồ cột nhạt màu */}
          <div className="flex items-end justify-between h-32 gap-2 px-2">
            {[40, 70, 45, 90, 65, 30, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-50 rounded-t-lg relative group hover:bg-blue-600 transition-all cursor-pointer" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block">{h}m</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 px-1 uppercase tracking-tighter">
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
          <p className="text-xs text-center mt-6 text-gray-500 font-medium">Bạn đã học <span className="text-blue-600 font-bold">12.5 giờ</span> tuần này</p>
        </div>

        {/* 2. Thành tích mới */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-blue-600">military_tech</span> Thành tích mới
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                <span className="material-symbols-outlined">local_fire_department</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">7 Ngày Liên Tiếp</p>
                <p className="text-[10px] text-gray-400 font-medium italic">Duy trì học tập mỗi ngày</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">
            Xem tất cả thành tích
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;