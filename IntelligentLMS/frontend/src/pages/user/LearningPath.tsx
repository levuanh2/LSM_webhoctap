const LearningPath = () => {
  const steps = [
    { name: "Cấu trúc tập tin PE", status: "completed", icon: "check_circle" },
    { name: "Trích xuất đặc trưng tĩnh", status: "current", icon: "play_circle" },
    { name: "Huấn luyện mô hình Học máy", status: "locked", icon: "lock" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Lộ trình AI: Malware Detection</h2>
      <div className="relative space-y-12 ml-6">
        {/* Đường kẻ dọc nối các node */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-blue-100" />
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-center gap-6 group">
            <div className={`size-8 rounded-full z-10 flex items-center justify-center border-4 border-white shadow-sm ${
              step.status === 'completed' ? 'bg-blue-600 text-white' : 
              step.status === 'current' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-200 text-gray-400'
            }`}>
              <span className="material-symbols-outlined text-sm">{step.icon}</span>
            </div>
            <div className={`p-4 rounded-2xl border flex-1 ${
              step.status === 'current' ? 'bg-blue-50 border-blue-200 shadow-blue-50' : 'bg-white border-gray-100'
            }`}>
              <p className={`font-bold ${step.status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>{step.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;