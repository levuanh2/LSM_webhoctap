import { motion, Variants } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

// ─── Variants Chuyển Động ──────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const CourseDetail = () => {
  const { id } = useParams(); // Lấy ID khóa học từ URL

  // Dữ liệu mẫu (Sau này Diey sẽ lấy từ API)
  const course = {
    title: "Phát triển Game Engine cơ bản với C++",
    description: "Học cách xây dựng một bộ công cụ làm game từ con số 0. Khám phá kiến trúc Engine, Rendering và Physics.",
    instructor: "Admin Diey",
    price: "Miễn phí",
    students: 1250,
    rating: 4.9,
    lessons: [
      { id: 1, title: "Giới thiệu kiến trúc Game Engine", duration: "15:00", type: "video" },
      { id: 2, title: "Thiết lập môi trường phát triển C++", duration: "20:30", type: "video" },
      { id: 3, title: "Xây dựng hệ thống quản lý tài nguyên", duration: "45:00", type: "video" },
      { id: 4, title: "Tối ưu hóa bộ nhớ & Quản lý RAM", duration: "30:15", type: "lock" },
    ]
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 max-w-[1200px] mx-auto space-y-8 font-sans"
    >
      {/* 1. Nút Quay lại & Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Link to="/user/courses" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm">
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại danh sách khóa học
        </Link>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: Thông tin chi tiết */}
        <div className="flex-1 space-y-8">
          {/* Header khóa học */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl font-black text-gray-800 leading-tight">{course.title}</h1>
            <p className="text-gray-500 text-lg leading-relaxed">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 items-center pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 fill-1">star</span>
                <span className="font-bold text-gray-800">{course.rating}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="material-symbols-outlined">group</span>
                <span className="text-sm font-medium">{course.students} học viên</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="material-symbols-outlined">person</span>
                <span className="text-sm font-medium">Giảng viên: {course.instructor}</span>
              </div>
            </div>
          </motion.div>

          {/* Danh sách bài học (Curriculum) */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-black text-gray-800">Nội dung bài học</h3>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              {course.lessons.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className={`flex items-center justify-between p-5 border-b border-gray-50 last:border-none group hover:bg-gray-50 transition-all ${lesson.type === 'lock' ? 'opacity-60' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{lesson.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{lesson.duration} phút</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-600 transition-all">
                    {lesson.type === 'lock' ? 'lock' : 'play_circle'}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* CỘT PHẢI: Card đăng ký (Sticky) */}
        <motion.div 
          variants={itemVariants}
          className="w-full lg:w-80"
        >
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 sticky top-24">
            <div className="aspect-video bg-blue-50 rounded-2xl mb-6 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-6xl opacity-20">videogame_asset</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-blue-600">{course.price}</span>
              </div>
              
              <Link 
                to={`/user/lesson/${id}`}
                className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-center text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                VÀO HỌC NGAY
              </Link>
              
              <div className="pt-4 space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Khóa học này bao gồm</p>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <span className="material-symbols-outlined text-blue-600 text-lg">description</span>
                  Tài liệu PE File Static Analysis
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <span className="material-symbols-outlined text-blue-600 text-lg">terminal</span>
                  Source Code Engine mẫu
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <span className="material-symbols-outlined text-blue-600 text-lg">verified</span>
                  Chứng chỉ hoàn thành
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;