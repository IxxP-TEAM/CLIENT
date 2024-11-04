import api from './api';

export const login = async (connId, password) => {
    try {
        // userData 객체 생성
        const userData = {
            connId,
            password
        };
        
        // POST 요청으로 userData 전송
        const response = await api.post('/users/login', userData);
        
        const { accessToken } = response.data.data; // accessToken 추출
        localStorage.setItem('accessToken', accessToken); // 로컬 스토리지에 저장

        return response.data; // 응답 반환
    } catch (error) {
        console.error('Login failed: ', error);
        throw error; // 에러를 다시 던짐
    }
}