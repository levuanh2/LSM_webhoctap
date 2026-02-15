import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// ─── Variants ──────────────────────────────────────────────────────────────
const panelVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  }),
};

// password strength
const getStrength = (pw: string) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_META = [
  null,
  { label: 'Yếu',      color: '#f87171' },
  { label: 'Tạm được', color: '#fb923c' },
  { label: 'Tốt',      color: '#a3e635' },
  { label: 'Mạnh',     color: '#34d399' },
];

// ─── InputField ────────────────────────────────────────────────────────────
interface InputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  icon: string;
  suffix?: React.ReactNode;
  extraClass?: string;
}
const InputField = ({ label, id, type = 'text', placeholder, value, onChange, icon, suffix, extraClass = '' }: InputProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-[13px] font-semibold text-[#52525b]">
      {label}
    </label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#a1a1aa] pointer-events-none select-none">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`w-full pl-10 pr-10 py-3 rounded-xl text-[14px] text-[#18181b] bg-[#f4f4f5] border border-transparent
          placeholder-[#a1a1aa] outline-none transition-all duration-150
          focus:bg-white focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] ${extraClass}`}
      />
      {suffix}
    </div>
  </div>
);

// ─── Main ──────────────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const [[tab, dir], setTab] = useState<['login' | 'register', number]>(['login', 0]);

  const switchTab = (next: 'login' | 'register') => {
    if (next === tab) return;
    setTab([next, next === 'register' ? 1 : -1]);
  };

  // login
  const [lEmail, setLEmail]   = useState('');
  const [lPw, setLPw]         = useState('');
  const [showLPw, setShowLPw] = useState(false);
  const [remember, setRemember] = useState(false);

  // register
  const [rName, setRName]     = useState('');
  const [rEmail, setREmail]   = useState('');
  const [rPw, setRPw]         = useState('');
  const [rCf, setRCf]         = useState('');
  const [showRPw, setShowRPw] = useState(false);
  const [showRCf, setShowRCf] = useState(false);
  const [agree, setAgree]     = useState(false);

  const strength = getStrength(rPw);
  const match    = rCf !== '' && rPw === rCf;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/user/dashboard');
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    navigate('/user/dashboard');
  };

  const EyeToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#6366f1] transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">
        {show ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .auth-wrap { font-family: 'Sora', sans-serif; }

        .dot-bg {
          background-color: #fafafa;
          background-image: radial-gradient(#e4e4e7 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .auth-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 20px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
        }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .ring-spin { animation: spin-slow 12s linear infinite; }

        .tab-pill {
          background: #f4f4f5;
          border-radius: 10px;
          padding: 4px;
          position: relative;
          display: flex;
        }
        .tab-btn {
          position: relative; z-index: 1;
          flex: 1;
          padding: 7px 20px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #71717a;
          transition: color 0.2s;
          cursor: pointer;
          border: none; background: transparent;
          font-family: 'Sora', sans-serif;
        }
        .tab-btn.active { color: #18181b; }

        .btn-submit {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          background: #18181b;
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.18);
        }
        .btn-submit:hover   { background: #27272a; box-shadow: 0 4px 20px rgba(0,0,0,0.22); }
        .btn-submit:active  { transform: scale(0.98); }
        .btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-social {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 11px;
          border-radius: 10px;
          border: 1.5px solid #e4e4e7;
          background: #fff;
          font-size: 13px; font-weight: 600; color: #3f3f46;
          cursor: pointer; font-family: 'Sora', sans-serif;
          transition: border-color 0.15s, background 0.15s, transform 0.12s;
        }
        .btn-social:hover { border-color: #a1a1aa; background: #fafafa; transform: translateY(-1px); }

        .divider { display: flex; align-items: center; gap: 12px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e4e4e7; }
        .divider span { font-size: 11px; color: #a1a1aa; font-weight: 500; white-space: nowrap; }

        .strength-track { height: 3px; background: #f4f4f5; border-radius: 99px; overflow: hidden; }
        .strength-fill  {
          height: 100%; border-radius: 99px;
          transition: width 0.35s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s;
        }

        input[type=checkbox].cbox {
          appearance: none; -webkit-appearance: none;
          width: 17px; height: 17px; border-radius: 5px;
          border: 1.5px solid #d4d4d8; background: #fff;
          cursor: pointer; flex-shrink: 0; margin-top: 1px;
          transition: border-color 0.15s, background 0.15s;
        }
        input[type=checkbox].cbox:checked {
          background: #18181b; border-color: #18181b;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="auth-wrap dot-bg min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] space-y-6">

          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 56 56" className="ring-spin absolute inset-0 w-full h-full" fill="none">
                <circle cx="28" cy="28" r="26" stroke="#e4e4e7" strokeWidth="1.5" strokeDasharray="5 5" />
              </svg>
              <div className="absolute inset-2 rounded-full bg-[#18181b] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[#18181b]">LMS Platform</p>
              <p className="text-[12px] text-[#a1a1aa] mt-0.5">
                Học tập thông minh cùng <span className="text-[#6366f1] font-semibold">Diey</span>
              </p>
            </div>
          </motion.div>

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
            className="auth-card p-7"
          >
            {/* ── Tabs ── */}
            <div className="tab-pill mb-7">
              <motion.div
                layoutId="tab-thumb"
                style={{
                  position: 'absolute',
                  top: 4, bottom: 4,
                  width: '50%',
                  borderRadius: 7,
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                }}
                animate={{ left: tab === 'login' ? '4px' : 'calc(50%)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <button className={`tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
                Đăng nhập
              </button>
              <button className={`tab-btn ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
                Đăng ký
              </button>
            </div>

            {/* ── Forms ── */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>

                {/* ════ LOGIN ════ */}
                {tab === 'login' && (
                  <motion.form
                    key="login"
                    custom={dir}
                    variants={panelVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-[#18181b]">Chào mừng trở lại</p>
                      <p className="text-[12px] text-[#a1a1aa] mt-0.5">Tiếp tục hành trình học tập của bạn</p>
                    </div>

                    <InputField
                      id="l-email" label="Email" type="email" icon="mail"
                      placeholder="diey@example.com"
                      value={lEmail} onChange={setLEmail}
                    />

                    <InputField
                      id="l-pw" label="Mật khẩu"
                      type={showLPw ? 'text' : 'password'} icon="lock"
                      placeholder="Nhập mật khẩu"
                      value={lPw} onChange={setLPw}
                      suffix={<EyeToggle show={showLPw} onToggle={() => setShowLPw(v => !v)} />}
                    />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="cbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                        <span className="text-[13px] text-[#52525b]">Ghi nhớ tôi</span>
                      </label>
                      <a href="#" className="text-[12px] font-semibold text-[#6366f1] hover:underline">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className="btn-submit">Đăng nhập</button>

                    <div className="divider"><span>hoặc đăng nhập với</span></div>

                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" className="btn-social">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" />
                        Google
                      </button>
                      <button type="button" className="btn-social">
                        <img src="https://www.svgrepo.com/show/448234/microsoft.svg" className="w-4 h-4" alt="" />
                        Microsoft
                      </button>
                    </div>

                    <p className="text-center text-[12px] text-[#a1a1aa]">
                      Chưa có tài khoản?{' '}
                      <button type="button" onClick={() => switchTab('register')} className="text-[#6366f1] font-semibold hover:underline">
                        Đăng ký
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* ════ REGISTER ════ */}
                {tab === 'register' && (
                  <motion.form
                    key="register"
                    custom={dir}
                    variants={panelVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-[#18181b]">Tạo tài khoản</p>
                      <p className="text-[12px] text-[#a1a1aa] mt-0.5">Miễn phí, không cần thẻ tín dụng</p>
                    </div>

                    <InputField
                      id="r-name" label="Họ và tên" icon="person"
                      placeholder="Nguyễn Văn A"
                      value={rName} onChange={setRName}
                    />

                    <InputField
                      id="r-email" label="Email" type="email" icon="mail"
                      placeholder="diey@example.com"
                      value={rEmail} onChange={setREmail}
                    />

                    {/* Password + strength */}
                    <div className="space-y-1.5">
                      <label htmlFor="r-pw" className="block text-[13px] font-semibold text-[#52525b]">Mật khẩu</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#a1a1aa] pointer-events-none">lock</span>
                        <input
                          id="r-pw"
                          type={showRPw ? 'text' : 'password'}
                          required
                          value={rPw}
                          placeholder="Ít nhất 8 ký tự"
                          onChange={e => setRPw(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 rounded-xl text-[14px] text-[#18181b] bg-[#f4f4f5] border border-transparent
                            placeholder-[#a1a1aa] outline-none transition-all
                            focus:bg-white focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                        />
                        <EyeToggle show={showRPw} onToggle={() => setShowRPw(v => !v)} />
                      </div>
                      {rPw && (
                        <div className="space-y-1 pt-0.5">
                          <div className="strength-track">
                            <div
                              className="strength-fill"
                              style={{
                                width: `${(strength / 4) * 100}%`,
                                backgroundColor: STRENGTH_META[strength]?.color ?? '#f87171',
                              }}
                            />
                          </div>
                          <p className="text-[11px] font-medium" style={{ color: STRENGTH_META[strength]?.color }}>
                            {STRENGTH_META[strength]?.label}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm */}
                    <div className="space-y-1.5">
                      <label htmlFor="r-cf" className="block text-[13px] font-semibold text-[#52525b]">Xác nhận mật khẩu</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#a1a1aa] pointer-events-none">lock_reset</span>
                        <input
                          id="r-cf"
                          type={showRCf ? 'text' : 'password'}
                          required
                          value={rCf}
                          placeholder="Nhập lại mật khẩu"
                          onChange={e => setRCf(e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 rounded-xl text-[14px] text-[#18181b] bg-[#f4f4f5] placeholder-[#a1a1aa] outline-none transition-all border
                            ${rCf
                              ? match
                                ? 'border-[#34d399] focus:shadow-[0_0_0_3px_rgba(52,211,153,0.12)]'
                                : 'border-[#f87171] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
                              : 'border-transparent focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]'
                            } focus:bg-white`}
                        />
                        <EyeToggle show={showRCf} onToggle={() => setShowRCf(v => !v)} />
                      </div>
                      {rCf && !match && (
                        <p className="text-[11px] text-[#f87171] font-medium">Mật khẩu không khớp</p>
                      )}
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" className="cbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                      <span className="text-[12px] text-[#52525b] leading-relaxed">
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-[#6366f1] font-semibold hover:underline">Điều khoản dịch vụ</a>
                        {' '}và{' '}
                        <a href="#" className="text-[#6366f1] font-semibold hover:underline">Chính sách bảo mật</a>
                      </span>
                    </label>

                    <button type="submit" disabled={!agree} className="btn-submit">
                      Tạo tài khoản
                    </button>

                    <p className="text-center text-[12px] text-[#a1a1aa]">
                      Đã có tài khoản?{' '}
                      <button type="button" onClick={() => switchTab('login')} className="text-[#6366f1] font-semibold hover:underline">
                        Đăng nhập
                      </button>
                    </p>
                  </motion.form>
                )}

              </AnimatePresence>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-[11px] text-[#d4d4d8]"
          >
            © 2026 LMS Platform
          </motion.p>
        </div>
      </div>
    </>
  );
};

export default Login;