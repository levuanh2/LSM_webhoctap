const CourseCard = ({ title, price, tag, author }: any) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="h-44 bg-gray-100 relative">
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">BÁN CHẠY</span>
      </div>
      <div className="p-4">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{tag}</span>
        <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 h-12 leading-snug">{title}</h3>
        <p className="text-xs text-gray-400 mt-2">Giảng viên: <span className="text-gray-700 font-medium">{author}</span></p>
        <div className="flex items-center gap-1 mt-3 text-yellow-500">
           <span className="material-symbols-outlined text-[16px]">star</span>
           <span className="text-xs font-bold text-gray-700">4.9</span>
           <span className="text-xs text-gray-400">(2.4k)</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
           <span className="font-bold text-blue-700 text-lg">{price}</span>
           <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700">Xem chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;