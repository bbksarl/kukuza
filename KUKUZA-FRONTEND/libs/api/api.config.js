export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';

export const API_URLS = {
  auth: `${API_BASE_URL}/auth`,
  user: `${API_BASE_URL}/users`,
  analytics: `${API_BASE_URL}/analytics`,
  admin: `${API_BASE_URL}/admin`,
};
