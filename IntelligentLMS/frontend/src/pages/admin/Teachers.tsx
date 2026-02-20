import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

interface Teacher {
  id: number;
  name: string;
  title: string;
  major: string;
  students: number;
  courses: number;
  rating: number;
  avatar: string;
  status: 'active' | 'away' | 'offline';
  tags: string[];
  joined: string;
}

const Teachers = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<'table' | 'grid'>('table');

  const teachers: Teacher[] = [
    {
      id: 1,
      name: 'Dr. Nguyễn Văn A',
      title: 'Senior Lecturer',
      major: 'Game Engine Architecture',
      students: 450,
      courses: 5,
      rating: 4.9,
      avatar: 'NA',
      status: 'active',
      tags: ['C++', 'OpenGL', 'Physics Engine'],
      joined: 'Jan 2022',
    },
    {
      id: 2,
      name: 'MSc. Trần Thị B',
      title: 'Security Researcher',
      major: 'Malware Analysis — PE File',
      students: 320,
      courses: 3,
      rating: 4.8,
      avatar: 'TB',
      status: 'active',
      tags: ['Reverse Engineering', 'IDA Pro', 'Python'],
      joined: 'Mar 2022',
    },
    {
      id: 3,
      name: 'Dev Diey',
      title: 'Lead Mobile Developer',
      major: 'Flutter & Dart Expert',
      students: 890,
      courses: 7,
      rating: 4.95,
      avatar: 'DD',
      status: 'away',
      tags: ['Flutter', 'Dart', 'Firebase'],
      joined: 'Aug 2021',
    },
    {
      id: 4,
      name: 'Prof. Lê Văn C',
      title: 'Professor',
      major: 'Machine Learning & AI',
      students: 1240,
      courses: 9,
      rating: 4.7,
      avatar: 'LC',
      status: 'active',
      tags: ['PyTorch', 'TensorFlow', 'MLOps'],
      joined: 'Nov 2020',
    },
    {
      id: 5,
      name: 'Eng. Phạm Thị D',
      title: 'DevOps Engineer',
      major: 'Cloud Infrastructure & K8s',
      students: 280,
      courses: 4,
      rating: 4.85,
      avatar: 'PD',
      status: 'offline',
      tags: ['Docker', 'Kubernetes', 'AWS'],
      joined: 'Jun 2023',
    },
  ];

  const statusColor = {
    active: '#10b981',
    away: '#f59e0b',
    offline: '#6b7280',
  };

  const statusLabel = {
    active: 'Đang hoạt động',
    away: 'Vắng mặt',
    offline: 'Ngoại tuyến',
  };

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.major.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Tổng giảng viên', value: teachers.length, icon: 'school', color: '#3b82f6' },
    { label: 'Đang hoạt động', value: teachers.filter((t) => t.status === 'active').length, icon: 'check_circle', color: '#10b981' },
    { label: 'Tổng học viên', value: teachers.reduce((a, t) => a + t.students, 0).toLocaleString(), icon: 'group', color: '#a855f7' },
    { label: 'Điểm TB', value: (teachers.reduce((a, t) => a + t.rating, 0) / teachers.length).toFixed(2), icon: 'star', color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-8 overflow-auto">
      {/* Grid BG */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-6 bg-purple-500 rounded-full" />
              <span className="text-xs font-bold tracking-[0.3em] text-purple-400 uppercase">Management</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight">
              Quản lý{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Giảng viên
              </span>
            </h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-sm transition-colors self-start md:self-auto">
            <span className="material-symbols-outlined">person_add</span>
            Thêm giảng viên
          </button>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                background: `${s.color}20`, boxShadow: `0 0 16px ${s.color}20`,
              }}>
                <span className="material-symbols-outlined" style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-black tabular-nums">{s.value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-xl">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm giảng viên, chuyên môn..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 outline-none transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            {(['table', 'grid'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  view === v ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {v === 'table' ? 'table_rows' : 'grid_view'}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table View */}
        <AnimatePresence mode="wait">
          {view === 'table' ? (
            <motion.div
              key="table"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Giảng viên', 'Chuyên môn', 'Tags', 'Học viên', 'Rating', 'Trạng thái', 'Hành động'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setSelected(selected === t.id ? null : t.id)}
                      className={`border-b border-white/5 last:border-none transition-all cursor-pointer ${
                        selected === t.id ? 'bg-purple-500/10' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                              style={{
                                background: `linear-gradient(135deg, #667eea, #764ba2)`,
                                boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
                              }}
                            >
                              {t.avatar}
                            </div>
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0f1e]"
                              style={{ backgroundColor: statusColor[t.status] }}
                            />
                          </div>
                          <div>
                            <p className="font-black text-sm text-white">{t.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold">{t.title}</p>
                          </div>
                        </div>
                      </td>

                      {/* Major */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-purple-400">{t.major}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">Joined {t.joined}</p>
                      </td>

                      {/* Tags */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {t.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Students */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-400 text-base">group</span>
                          <span className="font-black tabular-nums">{t.students.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-0.5">{t.courses} khóa học</p>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-amber-400 text-base">star</span>
                          <span className="font-black text-amber-400 tabular-nums">{t.rating}</span>
                        </div>
                        <div className="w-16 h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                            style={{ width: `${(t.rating / 5) * 100}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest"
                          style={{
                            background: `${statusColor[t.status]}20`,
                            color: statusColor[t.status],
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: statusColor[t.status] }}
                          />
                          {statusLabel[t.status]}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 transition-all text-gray-500">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-all text-gray-500">
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-all text-gray-500">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  {filtered.length} / {teachers.length} giảng viên
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                        p === 1 ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Grid View */
            <motion.div
              key="grid"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 overflow-hidden group"
                >
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.08) 0%, transparent 70%)',
                  }} />

                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg" style={{
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        boxShadow: '0 8px 24px rgba(102,126,234,0.4)',
                      }}>
                        {t.avatar}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0f1e]" style={{ backgroundColor: statusColor[t.status] }} />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest" style={{
                      background: `${statusColor[t.status]}20`,
                      color: statusColor[t.status],
                    }}>
                      {statusLabel[t.status]}
                    </span>
                  </div>

                  <h3 className="font-black text-base mb-0.5">{t.name}</h3>
                  <p className="text-xs text-gray-500 font-bold mb-1">{t.title}</p>
                  <p className="text-sm font-bold text-purple-400 mb-4">{t.major}</p>

                  <div className="flex gap-4 mb-4 text-center">
                    <div className="flex-1 p-3 rounded-xl bg-white/5">
                      <p className="text-lg font-black">{t.students.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Học viên</p>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-white/5">
                      <p className="text-lg font-black">{t.courses}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Khóa học</p>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-white/5">
                      <p className="text-lg font-black text-amber-400">{t.rating}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Rating</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button className="flex-1 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white text-xs font-black transition-all">
                      Chỉnh sửa
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-black transition-all">
                      Xem hồ sơ
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Teachers;