import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { getRole } from "./utils/auth";
import PageSpinner from "./components/PageSpinner";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const Courses = lazy(() => import("./pages/user/Courses"));
const LearningPath = lazy(() => import("./pages/user/LearningPath"));
const Achievements = lazy(() => import("./pages/user/Achievements"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Notifications = lazy(() => import("./pages/user/Notifications"));
const LessonView = lazy(() => import("./pages/user/LessonView"));
const CourseDetail = lazy(() => import("./pages/user/CourseDetail"));
const PaymentResult = lazy(() => import("./pages/user/PaymentResult"));
const AiHub = lazy(() => import("./pages/user/AiHub"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const SystemMonitor = lazy(() => import("./pages/admin/SystemMonitor"));
const Teachers = lazy(() => import("./pages/admin/Teachers"));
const Users = lazy(() => import("./pages/admin/Users"));
const CoursesAdmin = lazy(() => import("./pages/admin/Courses"));
const TeacherDashboard = lazy(() => import("./pages/teacher/Dashboard"));

const Sus = ({ children }: { children: ReactElement }) => (
  <Suspense fallback={<PageSpinner />}>{children}</Suspense>
);

function RoleBasedDashboard() {
  const role = getRole();
  if (role === "teacher")
    return (
      <Sus>
        <TeacherDashboard />
      </Sus>
    );
  return (
    <Sus>
      <AdminDashboard />
    </Sus>
  );
}

function AdminOnly({ children }: { children: ReactElement }) {
  const role = getRole();
  if (role !== "admin") return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />

      <Route element={<UserLayout />}>
        <Route
          path="/user/dashboard"
          element={
            <Sus>
              <Dashboard />
            </Sus>
          }
        />
        <Route
          path="/user/courses"
          element={
            <Sus>
              <Courses />
            </Sus>
          }
        />
        <Route
          path="/user/course/:id"
          element={
            <Sus>
              <CourseDetail />
            </Sus>
          }
        />
        <Route
          path="/user/learning-path"
          element={
            <Sus>
              <LearningPath />
            </Sus>
          }
        />
        <Route
          path="/user/ai"
          element={
            <Sus>
              <AiHub />
            </Sus>
          }
        />
        <Route
          path="/user/achievements"
          element={
            <Sus>
              <Achievements />
            </Sus>
          }
        />
        <Route
          path="/user/profile"
          element={
            <Sus>
              <Profile />
            </Sus>
          }
        />
        <Route
          path="/user/notifications"
          element={
            <Sus>
              <Notifications />
            </Sus>
          }
        />
        <Route
          path="/user/lesson/:courseId"
          element={
            <Sus>
              <LessonView />
            </Sus>
          }
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<RoleBasedDashboard />} />
        <Route
          path="/admin/monitor"
          element={
            <AdminOnly>
              <Sus>
                <SystemMonitor />
              </Sus>
            </AdminOnly>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <AdminOnly>
              <Sus>
                <Teachers />
              </Sus>
            </AdminOnly>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminOnly>
              <Sus>
                <Users />
              </Sus>
            </AdminOnly>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <Sus>
              <CoursesAdmin />
            </Sus>
          }
        />
      </Route>

      <Route
        path="/payment/result"
        element={
          <Sus>
            <PaymentResult />
          </Sus>
        }
      />

      <Route path="/" element={<Navigate to="/user/dashboard" />} />
      <Route path="/courses" element={<Navigate to="/user/courses" />} />

      <Route
        path="*"
        element={
          <div className="lms-mesh-bg flex min-h-screen flex-col items-center justify-center px-6 py-16">
            <div className="max-w-md text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.35em] text-primary/70">Lỗi 404</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Trang không tồn tại</h1>
              <p className="mt-3 text-slate-500">
                Đường dẫn bạn mở không có trong hệ thống. Hãy quay lại trang chủ hoặc kiểm tra URL.
              </p>
              <a
                href="/user/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-hover"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                Về trang chủ
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
