const Achievements = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Thành tích & Kỷ lục</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "7 Ngày Liên Tiếp", icon: "local_fire_department", color: "text-orange-500" },
          { label: "Vua Game Engine", icon: "videogame_asset", color: "text-blue-500" },
          { label: "Chuyên gia AI", icon: "psychology", color: "text-purple-500" },
          { label: "Premium Member", icon: "verified", color: "text-blue-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 text-center flex flex-col items-center gap-3">
            <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center mb-2">
              <span className={`material-symbols-outlined text-4xl ${item.color}`}>{item.icon}</span>
            </div>
            <p className="text-sm font-bold text-gray-800 leading-tight">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;