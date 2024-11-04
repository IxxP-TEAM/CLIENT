<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <header class="fixed-header" v-if="showLogoutButton">
        <button @click="logout">로그아웃</button>
    </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';

const router = useRouter();
const route = useRoute();
const showLogoutButton = ref(false);

const checkAuth = () => {
  // 로그인 상태를 체크하고, /login 페이지가 아닐 때만 로그아웃 버튼을 보이게 함
    showLogoutButton.value = localStorage.getItem('accessToken') !== null && route.path !== '/login';
};

// 로그아웃 함수
const logout = () => {
    sessionStorage.removeItem('accessToken');
    alert('로그아웃되었습니다.');
    router.push('/login');
};

// 로그인 상태와 페이지 경로가 변경될 때마다 로그아웃 버튼 표시 여부를 업데이트
watchEffect(() => {
    checkAuth();
});
</script>

<style scoped>
.fixed-header {
    position: fixed;
    top: 0;
    left: 250px; /* 사이드바 너비만큼 오른쪽으로 이동 */
    width: calc(100% - 250px); /* 화면에서 사이드바 너비를 제외한 부분 */
    height: 75px; /* 헤더의 높이 설정 */
    background-color: #3F72AF;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
</style>