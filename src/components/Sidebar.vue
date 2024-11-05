<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <aside v-if="showSidebar" class="sidebar">
    <div class="logo">
      <img src="/src/assets/logo.png" alt="IXXP ERP Logo" />
    </div>

    <!-- 로그인 정보 섹션 -->
    <div class="login-info">
      <p>로그인 사용자: {{  userName  }}</p>
      <p>관리자</p> <!-- 예시 텍스트 -->
    </div>

    <nav>
      <!-- 예시 1 드롭다운 -->
      <div class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown1')">
          영업 관리
        </div>
        <div v-if="isDropdownOpen === 'dropdown1'" class="dropdown-content">
          <router-link to="/customer-list">고객사 목록</router-link>
          <a href="#예시1-2">예시 1-2</a>
        </div>
      </div>

      <!-- 예시 2 드롭다운 -->
      <div class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown2')">
          예시 2
        </div>
        <div v-if="isDropdownOpen === 'dropdown2'" class="dropdown-content">
          <a href="#예시2-1">예시 2-1</a>
          <a href="#예시2-2">예시 2-2</a>
          <a href="#예시2-3">예시 2-3</a>
        </div>
      </div>

      <!-- 예시 3 드롭다운 -->
      <div class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown3')">
          예시 3
        </div>
        <div v-if="isDropdownOpen === 'dropdown3'" class="dropdown-content">
          <a href="#예시3-1">예시 3-1</a>
          <a href="#예시3-2">예시 3-2</a>
          <a href="#예시3-3">예시 3-3</a>
        </div>
      </div>

      <!-- 예시 4 드롭다운 -->
      <div class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown4')">
          예시 4
        </div>
        <div v-if="isDropdownOpen === 'dropdown4'" class="dropdown-content">
          <a href="#예시4-1">예시 4-1</a>
          <a href="#예시4-2">예시 4-2</a>
          <a href="#예시4-3">예시 4-3</a>
        </div>
      </div>

    </nav>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import VueJwtDecode from 'vue-jwt-decode'
import { onMounted } from 'vue';

const route = useRoute();
const isDropdownOpen = ref(null); // 현재 열려 있는 드롭다운 메뉴 상태
const userName = ref('')

// 사이드바 표시 여부를 결정하는 computed property
const showSidebar = computed(() => {
  return route.path !== '/login';
});

// 드롭다운 토글 함수
const toggleDropdown = (dropdown) => {
  isDropdownOpen.value = isDropdownOpen.value === dropdown ? null : dropdown;
};

// 로그인한 사용자 이름 가져오는 함수
const getUserNameFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    userName.value = decodedToken.username;
    console.log(userName.value);
  }
};

onMounted(() => {
  getUserNameFromToken();
});
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: #f4f4f4;
  color: #333;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo {
  width: 100%;
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo img {
  max-width: 110%;
  height: auto;
}

.login-info {
  width: 100%;
  text-align: center;
  padding: 10px 0;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 14px;
}

.dropdown-title {
  width: 100%;
  padding: 10px;
  color: #3F72AF; 
  text-decoration: none;
  font-size: 14px;
  display: block;
  cursor: pointer;
  font-weight: bold; 
}

.dropdown-title:hover {
  background-color: #ddd;
  border-radius: 4px;
}

.dropdown-content {
  display: flex;
  flex-direction: column;
  padding-left: 10px; 
}

.dropdown-content a {
  padding: 8px 10px;
  color: #333; 
  text-decoration: none;
  font-size: 13px;
  font-weight: normal; 
}

.dropdown-content a:hover {
  background-color: #ddd;
  border-radius: 4px;
}
</style>