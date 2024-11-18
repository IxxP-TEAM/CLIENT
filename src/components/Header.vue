<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <header class="fixed-header" v-if="showLogoutButton">
        <button @click="logout" class="logout-button">로그아웃</button>
    </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, watch, onMounted, nextTick } from 'vue';
import apiService from '@/api/apiService';

const router = useRouter();
const route = useRoute();
const showLogoutButton = ref(false);


// 로그인 상태 확인
const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    console.log('현재 토큰:', token); // 디버깅 로그
    showLogoutButton.value = token !== null && route.path !== '/login';
};
const logout = async () => {
    try {
        // 로그아웃 API 호출
        await apiService.logout();

        localStorage.removeItem('accessToken');

        router.push('/login');
    } catch (error) {
        console.error('로그아웃 실패:', error);
    }
}
// 페이지가 처음 로드될 때 checkAuth 실행
onMounted(() => {
    nextTick(() => {
        checkAuth();
    });
});

// 라우터 변경될 때마다 checkAuth 실행
watch(() => route.path, () => {
    nextTick(() => {
        checkAuth();
    });
});
</script>

<style scoped>
.fixed-header {
    position: fixed;
    top: 0;
    left: 250px;
    width: calc(100% - 250px);
    height: 75px;
    background-color: #3F72AF;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    z-index: 1000;
}

.logout-button {
    background-color: #3F72AF;
    color: #fff;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 10px;
    border-radius: 5px;
}

.logout-button:hover {
    background-color: #f1f1f1;
}
</style>