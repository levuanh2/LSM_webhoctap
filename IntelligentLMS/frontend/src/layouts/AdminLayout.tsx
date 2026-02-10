import { Outlet, Navigate } from 'react-router-dom';
import { getRole, isAuthenticated } from '../utils/auth';

const AdminLayout = () => {
  if (!isAuthenticated()) return <Navigate to="/auth/login" replace />;
  if (getRole() !== 'admin') return <Navigate to="/user/dashboard" replace />;

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-background-dark">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
