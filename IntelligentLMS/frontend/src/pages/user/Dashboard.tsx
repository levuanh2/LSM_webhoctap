import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 }
  }
};

// Dữ liệu biểu đồ
const weekData = [
  { day: 'T2', h: 40 },
  { day: 'T3', h: 70 },
  { day: 'T4', h: 45 },
  { day: 'T5', h: 90 },
  { day: 'T6', h: 65 },
  { day: 'T7', h: 30 },
  { day: 'CN', h: 55 },
];

const Dashboard = () => {
  return (
    <>
      {/* Font import – thêm vào <head> nếu chưa có */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');
        .db-root { font-family: 'DM Sans', sans-serif; }
        .db-mono { font-family: 'DM Mono', monospace; }

        /* Gradient mesh nền */
        .mesh-bg {
          background-color: #f4f6fb;
          background-image:
            radial-gradient(at 20% 10%, rgba(99,122,255,0.12) 0px, transparent 50%),
            radial-gradient(at 80% 0%,  rgba(139,92,246,0.08) 0px, transparent 50%),
            radial-gradient(at 5%  80%, rgba(59,130,246,0.07) 0px, transparent 50%);
        }

        /* Glass card */
        .glass {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 24px rgba(99,122,255,0.07), 0 1px 3px rgba(0,0,0,0.04);
        }

        .glass-hover:hover {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 8px 40px rgba(99,122,255,0.13), 0 2px 8px rgba(0,0,0,0.06);
        }

        /* Badge glow */
        .badge-glow {
          box-shadow: 0 0 16px rgba(99,122,255,0.35);
        }

        /* Progress bar shimmer */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .progress-bar {
          background: linear-gradient(90deg, #4f6ef7, #818cf8, #4f6ef7);
          background-size: 200% auto;
          animation: shimmer 2.8s linear infinite;
        }

        /* Pulse dot */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }

        /* Bar chart active */
        .bar-active { background: linear-gradient(to top, #4f6ef7, #818cf8); }

        /* Streak flame */
        @keyframes flicker {
          0%, 100% { transform: scaleY(1) rotate(-1deg); }
          50% { transform: scaleY(1.06) rotate(1deg); }
        }
        .flame { animation: flicker 1.2s ease-in-out infinite; display: inline-block; }
      `}</style>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="db-root mesh-bg min-h-screen p-6 md:p-10 flex gap-8 flex-col xl:flex-row max-w-[1440px] mx-auto"
      >

        {/* ─── CỘT TRÁI ─────────────────────────────── */}
        <div className="flex-1 space-y-8 min-w-0">

          {/* ① Lời chào */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-1">
              <p className="db-mono text-[11px] text-indigo-400 uppercase tracking-[0.2em] font-medium">
                <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 mb-0.5" />
                Dashboard
              </p>
              <span className="db-mono text-[11px] text-gray-400">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tight leading-tight">
              Chào trở lại,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Diey</span>
                <span className="absolute bottom-0.5 left-0 w-full h-2 bg-indigo-100 rounded-full z-0" />
              </span>{' '}
              👋
            </h2>
          </motion.section>

          {/* ② Khóa học đang học */}
          <motion.section variants={item}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="glass glass-hover rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden"
            >
              {/* Accent top-left corner */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-br-[80px]" />
              <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-indigo-400 badge-glow" />

              {/* Thumbnail */}
              <div className="w-full md:w-56 h-44 rounded-2xl overflow-hidden relative bg-gradient-to-br from-indigo-50 to-violet-50 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[90px] text-indigo-200">videogame_asset</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-indigo-500 drop-shadow-md">terminal</span>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-100/40 to-transparent" />
              </div>

              {/* Info */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest badge-glow">
                    ● ĐANG HỌC
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-full uppercase tracking-widest">
                    Game Dev
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight tracking-tight">
                  Phát triển Game Engine cơ bản
                </h3>
                <p className="text-sm text-gray-400 mt-1.5 font-medium">
                  Tiếp theo: <span className="text-indigo-500 font-semibold">Tối ưu hóa bộ nhớ & Quản lý tài nguyên</span>
                </p>

                {/* Progress */}
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-600">Tiến độ tổng thể</span>
                    <span className="db-mono text-xs font-bold text-indigo-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                      className="progress-bar h-full rounded-full"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5 db-mono">18 / 24 bài học đã hoàn thành</p>
                </div>

                {/* CTA */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-6 inline-flex"
                >
                  <Link
                    to="/user/lesson/1"
                    className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-7 py-3 rounded-2xl font-black text-sm hover:from-indigo-600 hover:to-violet-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    Học tiếp
                    <span className="material-symbols-outlined text-xl">play_arrow</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.section>

          {/* ③ Gợi ý từ AI */}
          <section>
            <motion.div variants={item} className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-black text-gray-900 tracking-tight">Gợi ý từ AI</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Dựa trên hành trình học của bạn</p>
              </div>
              <button className="db-mono text-[10px] text-indigo-500 font-bold uppercase tracking-widest hover:underline">
                Xem tất cả →
              </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thẻ 1 */}
              <motion.div
                variants={item}
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass glass-hover rounded-3xl p-5 flex gap-4 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">security</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-indigo-500 flex items-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span> AI ĐỀ XUẤT
                  </span>
                  <h4 className="font-bold text-gray-800 text-sm mt-1 leading-snug">
                    Phân tích đặc trưng tĩnh tập tin PE
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-tight db-mono">
                    Dành cho đồ án Mã độc
                  </p>
                </div>
                <span className="material-symbols-outlined text-gray-200 group-hover:text-indigo-300 transition-colors self-center text-xl">
                  chevron_right
                </span>
              </motion.div>

              {/* Thẻ 2 */}
              <motion.div
                variants={item}
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass glass-hover rounded-3xl p-5 flex gap-4 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-100 flex items-center justify-center text-sky-400 group-hover:text-sky-600 transition-colors flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-2xl">flutter_dash</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-indigo-500 flex items-center gap-1 uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span> AI ĐỀ XUẤT
                  </span>
                  <h4 className="font-bold text-gray-800 text-sm mt-1 leading-snug">
                    Flutter & Dart Nâng cao
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-tight db-mono">
                    Kỹ năng Mobile cần thiết
                  </p>
                </div>
                <span className="material-symbols-outlined text-gray-200 group-hover:text-indigo-300 transition-colors self-center text-xl">
                  chevron_right
                </span>
              </motion.div>
            </div>
          </section>
        </div>

        {/* ─── CỘT PHẢI ─────────────────────────────── */}
        <motion.div variants={item} className="w-full xl:w-72 space-y-5 flex-shrink-0">

          {/* ① Thống kê nhanh */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Streak', value: '7', unit: 'ngày', icon: 'local_fire_department', color: 'from-amber-400 to-orange-400', shadow: 'shadow-amber-200' },
              { label: 'Tuần này', value: '12.5', unit: 'giờ', icon: 'schedule', color: 'from-indigo-400 to-violet-500', shadow: 'shadow-indigo-200' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className={`glass rounded-3xl p-4 flex flex-col gap-1 shadow-lg ${stat.shadow}`}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-1`}>
                  <span className="material-symbols-outlined text-lg fill-1">{stat.icon}</span>
                </div>
                <p className="text-2xl font-black text-gray-900 leading-none">
                  {stat.value}
                  <span className="text-sm text-gray-400 font-medium ml-1">{stat.unit}</span>
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ② Biểu đồ tuần */}
          <div className="glass rounded-3xl p-6">
            <h4 className="font-black text-gray-800 flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-indigo-500 text-lg">bar_chart</span>
              Hoạt động tuần
            </h4>

            <div className="flex items-end justify-between h-28 gap-1.5">
              {weekData.map(({ day, h }, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="relative w-full" style={{ height: `${h}%` }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: 'bottom' }}
                      className={`w-full h-full rounded-lg transition-all cursor-pointer
                        ${h === 90
                          ? 'bar-active shadow-md shadow-indigo-200'
                          : 'bg-indigo-50 group-hover:bg-indigo-100'
                        }`}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap db-mono pointer-events-none z-10">
                      {h} phút
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-3 px-0.5">
              {weekData.map(({ day }, i) => (
                <span key={i} className="flex-1 text-center text-[9px] font-black text-gray-400 uppercase tracking-tight">
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* ③ Thành tích */}
          <div className="glass rounded-3xl p-6">
            <h4 className="font-black text-gray-800 flex items-center gap-2 mb-5 text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-indigo-500 text-lg">workspace_premium</span>
              Thành tích
            </h4>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-md shadow-amber-200 flex-shrink-0">
                <span className="flame material-symbols-outlined fill-1 text-xl">local_fire_department</span>
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">Chuỗi 7 ngày 🔥</p>
                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight mt-0.5">
                  Duy trì học tập liên tục
                </p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 border-2 border-dashed border-gray-150 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-indigo-200 hover:text-indigo-500 transition-all db-mono"
            >
              Xem bảng thành tích →
            </motion.button>
          </div>

          {/* ④ Mục tiêu hôm nay */}
          <div className="glass rounded-3xl p-6">
            <h4 className="font-black text-gray-800 flex items-center gap-2 mb-5 text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined text-indigo-500 text-lg">target</span>
              Mục tiêu hôm nay
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Hoàn thành 1 bài học', done: true },
                { label: 'Ôn tập 15 phút', done: true },
                { label: 'Làm bài tập thực hành', done: false },
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${goal.done ? 'bg-indigo-500' : 'border-2 border-gray-200'}`}>
                    {goal.done && <span className="material-symbols-outlined text-white text-[13px]">check</span>}
                  </div>
                  <span className={`text-xs font-semibold ${goal.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {goal.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hoàn thành</span>
                <span className="db-mono text-[10px] text-indigo-500 font-bold">2/3</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '66%' }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-gradient-to-r from-indigo-400 to-violet-400 h-full rounded-full"
                />
              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;