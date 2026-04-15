/** Base URL Gateway (Course, Auth, Progress, AI…). Ghi đè bằng VITE_API_BASE_URL khi deploy. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
