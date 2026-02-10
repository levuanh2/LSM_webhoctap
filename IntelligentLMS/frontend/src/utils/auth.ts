export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const login = (email: string, password: string) => {
  // mock login
  if (email && password) {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('role', email.includes('admin') ? 'admin' : 'user');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export const getRole = () => {
  return localStorage.getItem('role');
};
