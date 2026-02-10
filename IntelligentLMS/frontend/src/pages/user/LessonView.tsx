import { useState } from 'react';
import { useParams } from 'react-router-dom'; // Thêm để lấy ID từ thanh địa chỉ

const LessonView = () => {
  const { courseId } = useParams(); // Lấy "game-engine" hoặc "malware-detection"
  const [currentLesson, setCurrentLesson] = useState(0);

  // 1. KHO DỮ LIỆU RIÊNG CHO TỪNG KHÓA HỌC
  const courseContent: any = {
    "game-engine": {
      title: "Lập trình C++ cho Game Engine",
      videoUrl: "https://www.youtube.com/embed/TcranVQUQ5U",
      description: "Tìm hiểu sâu về Game Loop và xử lý vật lý cơ bản trong Unity.",
      docName: "Kien_truc_Engine.pdf",
      syllabus: [
        { title: "Giới thiệu về Game Engine", duration: "10:25", status: "completed" },
        { title: "Kiến trúc Game Loop", duration: "15:40", status: "current" },
        { title: "Quản lý tài nguyên", duration: "22:15", status: "locked" },
      ]
    },
    "malware-detection": {
      title: "Phát hiện mã độc & Phân tích PE",
      videoUrl: "https://www.youtube.com/embed/S_8X5Y-W89o",
      description: "Phân tích cấu trúc Static PE và trích xuất đặc trưng cho Model Học máy.",
      docName: "PE_Analysis_Note.docx",
      syllabus: [
        { title: "Cấu trúc tập tin PE cơ bản", duration: "12:00", status: "completed" },
        { title: "Trích xuất đặc trưng tĩnh", duration: "25:30", status: "current" },
        { title: "Huấn luyện Model Machine Learning", duration: "45:00", status: "locked" },
      ]
    },
    "flutter-mobile": {
      title: "Phát triển App với Flutter & Dart",
      videoUrl: "https://www.youtube.com/embed/IYV_HHP9_7A",
      description: "Xây dựng giao diện ứng dụng di động đa nền tảng.",
      docName: "Flutter_Dart_Basic.pdf",
      syllabus: [
        { title: "Cài đặt môi trường Flutter", duration: "08:15", status: "completed" },
        { title: "Widget & State Management", duration: "30:45", status: "current" },
      ]
    }
  };

  // Lấy dữ liệu theo ID, nếu không có thì mặc định lấy Game Engine
  const data = courseContent[courseId || "game-engine"] || courseContent["game-engine"];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-white animate-in fade-in duration-500">
      
      {/* KHU VỰC BÊN TRÁI: Video & Nội dung */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Video Player dùng dữ liệu động */}
        <div className="aspect-video bg-black w-full shadow-lg relative">
          <iframe 
            className="w-full h-full"
            src={data.videoUrl} 
            title="Lesson Video"
            allowFullScreen
          ></iframe>
        </div>

        <div className="p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {data.syllabus[currentLesson].title}
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Khóa học: <span className="text-blue-600 font-bold">{data.title}</span>
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-blue-100 text-blue-600 rounded-xl font-bold text-sm">
              <span className="material-symbols-outlined">bookmark</span> Lưu
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-100 mb-6">
            {['Tổng quan', 'Tài liệu'].map((tab, i) => (
              <button key={tab} className={`pb-4 text-sm font-bold ${i === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="text-gray-600 text-sm leading-relaxed space-y-4">
            <p>{data.description}</p>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
              <span className="material-symbols-outlined text-blue-600">description</span>
              <div className="flex-1 text-xs font-bold text-blue-900">{data.docName}</div>
              <button className="bg-white text-blue-600 p-2 rounded-lg"><span className="material-symbols-outlined">download</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC BÊN PHẢI: Syllabus động */}
      <aside className="w-full lg:w-96 bg-gray-50 border-l border-gray-100 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h3 className="font-bold text-gray-800">Nội dung học tập</h3>
          <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Tiến độ: {currentLesson + 1}/{data.syllabus.length} bài học</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {data.syllabus.map((item: any, index: number) => (
            <div 
              key={index}
              onClick={() => item.status !== 'locked' && setCurrentLesson(index)}
              className={`p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer border ${
                index === currentLesson ? "bg-white border-blue-200 shadow-sm" : "bg-transparent hover:bg-white/50"
              } ${item.status === 'locked' ? 'opacity-50' : ''}`}
            >
              <div className={`size-8 rounded-full flex items-center justify-center ${index === currentLesson ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">{item.title}</p>
                <p className="text-[10px] text-gray-400">{item.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LessonView;