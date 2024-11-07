// api.js
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8081/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 토큰을 헤더에 추가
  }
  return config;
}, error => Promise.reject(error));

// 응답 인터셉터
api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    console.error("Unauthorized access - redirecting to login");
    // 여기서 로그인 페이지로 리디렉션 할 수 있음
  }
  return Promise.reject(error);
});

export default api; // axios 인스턴스 내보내기