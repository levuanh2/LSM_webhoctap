import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import UserLayout from "./layouts/UserLayout";

// Auth
import Login from "./pages/auth/Login";

// User Pages
import Dashboard from "./pages/user/Dashboard";
import Courses from "./pages/user/Courses";
import LearningPath from "./pages/user/LearningPath";
import Achievements from "./pages/user/Achievements";
import Profile from "./pages/user/Profile";
import Notifications from "./pages/user/Notifications";
import LessonView from "./pages/user/LessonView";
import CourseDetail from "./pages/user/CourseDetail"; // Đã bổ sung

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import SystemMonitor from "./pages/admin/SystemMonitor";
import Teachers from "./pages/admin/Teachers";

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES: Trang Login đứng riêng */}
      <Route path="/login" element={<Login />} />

      {/* 2. USER ROUTES: Có Sidebar Academy & Header Blue */}
      <Route element={<UserLayout />}>
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/courses" element={<Courses />} />
        <Route path="/user/course/:id" element={<CourseDetail />} /> 
        <Route path="/user/learning-path" element={<LearningPath />} />
        <Route path="/user/achievements" element={<Achievements />} />
        <Route path="/user/profile" element={<Profile />} />  
        <Route path="/user/notifications" element={<Notifications />} /> 
        <Route path="/user/lesson/:courseId" element={<LessonView />} /> 
      </Route>

      {/* 3. ADMIN ROUTES: Bạn có thể dùng chung UserLayout hoặc tạo AdminLayout riêng */}
      <Route element={<UserLayout />}> 
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/monitor" element={<SystemMonitor />} />
        <Route path="/admin/teachers" element={<Teachers />} />
      </Route>

      {/* 4. DEFAULT REDIRECTS */}
      <Route path="/" element={<Navigate to="/user/dashboard" />} />
      <Route path="/courses" element={<Navigate to="/user/courses" />} />

      {/* Trang lỗi 404 (Nếu cần) */}
      <Route path="*" element={<div className="p-20 text-center font-black text-gray-300">404 - KHÔNG TÌM THẤY TRANG</div>} />
    </Routes>
  );
}

export default App;