import { API_URLS } from './api.config.js';
import { tokenService } from './AuthService.js';

export default class ApiService {
  constructor(baseURL = API_URLS.user){
    this.baseURL = baseURL;
  }

  async request(path, method = 'GET', data = null, extraHeaders = {}){
    const token = tokenService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...extraHeaders
    };

    const res = await fetch(`${this.baseURL}${path}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (!res.ok){
      const txt = await res.text();
      throw new Error(`API Error ${res.status}: ${txt}`);
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')){
      return res.json();
    }
    return res.text();
  }

  get(path){ return this.request(path, 'GET'); }
  post(path, data){ return this.request(path, 'POST', data); }
  put(path, data){ return this.request(path, 'PUT', data); }
  delete(path){ return this.request(path, 'DELETE'); }
}

export const api = new ApiService();
