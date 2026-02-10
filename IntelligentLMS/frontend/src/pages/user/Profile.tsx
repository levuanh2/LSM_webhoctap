const Profile = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-800">Cài đặt Hồ sơ</h2>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
          <div className="size-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold">D</div>
          <button type="button" className="text-sm font-bold text-blue-600 hover:underline">
            Thay đổi ảnh đại diện
          </button>
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Field: Họ và tên */}
            <div className="space-y-2">
              <label 
                htmlFor="full-name" 
                className="text-xs font-bold text-gray-400 uppercase ml-1"
              >
                Họ và tên
              </label>
              <input 
                id="full-name"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 border border-transparent transition-all text-sm" 
                defaultValue="Nguyễn Văn A" 
              />
            </div>

            {/* Field: Biệt danh */}
            <div className="space-y-2">
              <label 
                htmlFor="nickname" 
                className="text-xs font-bold text-gray-400 uppercase ml-1"
              >
                Biệt danh
              </label>
              <input 
                id="nickname"
                type="text"
                placeholder="Ví dụ: Diey"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 border border-transparent transition-all text-sm" 
                defaultValue="Diey" 
              />
            </div>

          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default Profile;