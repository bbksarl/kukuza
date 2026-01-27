export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.kukuza.com';

export const API_URLS = {
  auth: `${API_BASE_URL}/auth`,
  user: `${API_BASE_URL}/users`,
  analytics: `${API_BASE_URL}/analytics`,
  admin: `${API_BASE_URL}/admin`,
};
