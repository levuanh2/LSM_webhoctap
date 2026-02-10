// BƯỚC QUAN TRỌNG: Phải mở khóa dòng này ra thì React mới hiểu CourseCard là gì
import CourseCard from "../../components/CourseCard";

const CourseList = () => {
  return (
    <div className="p-8 max-w-[1440px] mx-auto">
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">
  Trang chủ &gt; <span className="text-blue-600">Khóa học</span>
</p>
        <h1 className="text-2xl font-bold text-gray-900">Danh sách Khóa học</h1>
        <p className="text-gray-500 text-sm">Khám phá hơn 500+ khóa học từ các chuyên gia hàng đầu</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Bộ lọc */}
        <aside className="w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">filter_list</span> Bộ lọc tìm kiếm
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Chủ đề</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-blue-600" /> Lập trình Web
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" /> Thiết kế UI/UX
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" /> Data Science
              </label>
            </div>
          </div>
        </aside>

        {/* Khu vực chính */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Tìm kiếm khóa học..." 
              />
            </div>
            <select aria-label="Sắp xếp danh sách khóa học"
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white outline-none">
              <option>Sắp xếp: Mới nhất</option>
              <option>Giá: Thấp đến Cao</option>
              <option>Giá: Cao đến Thấp</option>
            </select>
          </div>

          {/* Grid Khóa học */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCard 
              title="Thiết kế Web chuyên nghiệp với React và Tailwind" 
              price="1.290.000đ" 
              tag="Web Dev" 
              author="Lê Hồng Minh" 
            />
            <CourseCard 
              title="Mastering Figma: Từ Zero đến Pro trong 30 ngày" 
              price="850.000đ" 
              tag="UI/UX" 
              author="Nguyễn Thanh Tùng" 
            />
            <CourseCard 
              title="Python cho phân tích dữ liệu và AI cơ bản" 
              price="2.450.000đ" 
              tag="Data Science" 
              author="Trần Văn Hoàng" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;