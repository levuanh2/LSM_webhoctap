import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import Login from "./pages/auth/Login";
import LessonView from "./pages/user/LessonView";
import Notifications from "./pages/user/Notifications";
import Dashboard from "./pages/user/Dashboard";
import Courses from "./pages/user/Courses";
import LearningPath from "./pages/user/LearningPath";
import Achievements from "./pages/user/Achievements";
import Profile from "./pages/user/Profile";

function App() {
  return (
    <Routes>
      {/* Trang Login đứng riêng */}
      <Route path="/login" element={<Login />} />

      {/* Bộ khung Layout cho User */}
      <Route element={<UserLayout />}>
        {/* Đường dẫn phải khớp 100% với path trong Sidebar của Diey */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/courses" element={<Courses />} />
        <Route path="/user/learning-path" element={<LearningPath />} />
        <Route path="/user/achievements" element={<Achievements />} />
        <Route path="/user/profile" element={<Profile />} />  
        <Route path="/user/lesson/:id" element={<LessonView />} />
        <Route path="/user/notifications" element={<Notifications />} /> 
        <Route path="/user/lesson/:courseId" element={<LessonView />} /> 
      </Route>

      {/* Nếu vào trang chủ "/" thì tự động nhảy vào Dashboard cho máu */}
      <Route path="/" element={<Navigate to="/user/dashboard" />} />
      
      {/* Route dự phòng cho link cũ của bạn */}
      <Route path="/courses" element={<Navigate to="/user/courses" />} />
    </Routes>
  );
}

export default App;