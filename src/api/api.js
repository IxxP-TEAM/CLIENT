import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  // 필요하면 토큰 등을 추가 가능
  // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default api;