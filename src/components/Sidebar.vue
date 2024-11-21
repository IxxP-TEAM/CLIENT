<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <aside v-if="showSidebar" class="sidebar">
    <div class="logo">
      <img src="/src/assets/logo.png" alt="IXXP ERP Logo" @click="goToHome" style="cursor: pointer;" />
    </div>

    <div class="login-info">
      <p>로그인 사용자: {{ userName }}</p>
      <p class="target-role">{{ userRole === 'ROLE_ADMIN' ? '관리자' : '일반 사용자' }}</p>
    </div>

    <nav>
      <div class="attendance-btn">
        <button v-if="!isCheckIn" @click="openCheckInPopup" class="in-btn">출근하기</button>
        <button v-else @click="openCheckOutPopup" class="out-btn">퇴근하기</button>
      </div>

      <div v-if="userRole === 'ROLE_ADMIN'" class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown2')">
          인사관리
        </div>
        <div v-if="isDropdownOpen.dropdown2" class="dropdown-content">
          <router-link to="/empList" @click="setActiveSubMenu('employee-list')">직원 목록</router-link>
          <router-link to="/leave">휴가 관리</router-link>
        </div>
        <div class="dropdown-title" @click="toggleDropdown('dropdown3')">
          급여관리
        </div>
        <div v-if="isDropdownOpen.dropdown3" class="dropdown-content">
          <!-- <router-link to="/att-create">급여 등록</router-link> -->
          <router-link to="/pay-list-admin">급여 목록</router-link>
          <router-link to="/pay-create">급여 등록</router-link>
        </div>
      </div>
      <div v-if="userRole === 'ROLE_USER'" class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown6')">
          근태 관리
        </div>
        <div v-if="isDropdownOpen.dropdown6" class="dropdown-content">
          <router-link to="/my-leave">휴가 관리</router-link>
          <router-link to="/my-att">출퇴근 조회</router-link>
        </div>
        <div class="dropdown-title" @click="toggleDropdown('dropdown1')">
          영업/주문
        </div>
        <div v-if="isDropdownOpen.dropdown1" class="dropdown-content">
          <router-link to="/customer-list">고객사 목록</router-link>
          <router-link to="/order-list">주문 목록</router-link>
        </div>

        <!-- 게시판 -->
        <div class="dropdown-title" @click="toggleDropdown('dropdown7')">
          게시판
        </div>
        <div v-if="isDropdownOpen.dropdown7" class="dropdown-content">
          <router-link :to="{ name: 'BoardList', params: { type: 'NOTICE' } }">공지게시판</router-link>
          <router-link :to="{ name: 'BoardList', params: { type: 'FREE' } }">자유게시판</router-link>
          <router-link :to="{ name: 'BoardList', params: { type: 'ANONYMOUS' } }">익명게시판</router-link>
        </div>

        <!--판매 개요 메뉴-->
        <div class="dropdown-title" @click="toggleDropdown('dropdown5')">
          판매 개요
        </div>
        <div v-if="isDropdownOpen.dropdown5" class="dropdown-content">
          <router-link to="/sales-history">판매 이력</router-link>
          <router-link to="/customer-history">고객사별 매출</router-link>
          <router-link to="/totalsalesby-salesperson">사원별 매출</router-link>
          <router-link to="/monthlysales-statistics">기간별 매출</router-link>
        </div>

        <!-- 재고 관리 -->
        <div class="dropdown-title" @click="toggleDropdown('dropdown4')">
          재고관리
        </div>
        <div v-if="isDropdownOpen.dropdown4" class="dropdown-content">
          <router-link to="/products">제품 목록</router-link>
          <router-link to="/inventory">재고 목록</router-link>
          <router-link to="/inventory/history">재고 이력 목록</router-link>
        </div>

        <!--급여 관리-->
        <div class="dropdown-title" @click="toggleDropdown('dropdown8')">
          급여관리
        </div>
        <div v-if="isDropdownOpen.dropdown8" class="dropdown-content">
          <router-link to="/pay-list-user">급여 목록</router-link>
        </div>
      </div>
    </nav>
  </aside>

  <div v-show="showCheckInPopup" class="popup">
    <div class="popup-content">
      <p>출근하시겠습니까?</p>
      <button @click="confirmCheckIn" class="confirm-btn">확인</button>
      <button @click="cancelCheckIn" class="cancel-btn">취소</button>
      <p v-if="checkInError" class="error-message">출근하기 실패</p>
    </div>
  </div>

  <div v-show="showCheckOutPopup" class="popup">
    <div class="popup-content">
      <p>퇴근하시겠습니까?</p>
      <button @click="confirmCheckOut" class="confirm-btn">확인</button>
      <button @click="cancelCheckOut" class="cancel-btn">취소</button>
      <p v-if="checkOutError" class="error-message">퇴근하기 실패</p>
    </div>
  </div>

  <div v-if="checkInMessage" class="check-in-message">
    {{ checkInMessage }}
  </div>

  <div v-if="checkOutMessage" class="check-out-message">
    {{ checkOutMessage }}
  </div>

</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueJwtDecode from 'vue-jwt-decode'
import { onMounted } from 'vue';
import apiService from '@/api/apiService';

const route = useRoute();
const userName = ref('');
const userRole = ref('');
const isCheckIn = ref(false);
const showCheckInPopup = ref(false);
const showCheckOutPopup = ref(false);
const checkInError = ref(false);
const checkOutError = ref(false);
const checkInMessage = ref('');
const checkOutMessage = ref('');
const router = useRouter();

const isDropdownOpen = ref({
  dropdown1: false,
  dropdown2: false,
  dropdown3: false,
  dropdown4: false,
  dropdown5: false, // 매출 개요
  dropdown6: false, // 근태 관리
  dropdown7: false, // 게시판 
  dropdown8: false,

});

const goToHome = () => {
  router.push({ name: 'home' }); // 라우터를 통해 Home으로 이동
};

const showSidebar = computed(() => {
  return route.path !== '/login';
});

const activeMenu = ref('');
const activeSubMenu = ref('');

const setActiveMenu = (menu) => {
  activeMenu.value = menu;
};

const setActiveSubMenu = (subMenu) => {
  activeSubMenu.value = subMenu;
};


const toggleDropdown = (dropdown) => {
  if (activeMenu.value === dropdown) {
    activeMenu.value = '';
  } else {
    isDropdownOpen.value[dropdown] = !isDropdownOpen.value[dropdown];
    setActiveMenu(dropdown);
  }
};

const getUserNameFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    userName.value = decodedToken.username;
    userRole.value = decodedToken.role;
    console.log(userName.value);
  }
};

const checkInStatus = async () => {
  try {
    const response = await apiService.checkInStatus();
    console.log('출근 상태:', response.data.data.status);
    isCheckIn.value = response.data.data.status;
  } catch (error) {
    console.error('출근 상태 조회 실패', error);
  }
};

const openCheckInPopup = () => {
  showCheckInPopup.value = true;
  checkInError.value = false;
};

const openCheckOutPopup = () => {
  showCheckOutPopup.value = true;
  checkOutError.value = false;
};

const displayMessage = (messageType, message) => {
  if (messageType === 'checkIn') {
    checkInMessage.value = message;
    setTimeout(() => (checkInMessage.value = ''), 3000);
    checkOutMessage.value = message;
    setTimeout(() => (checkOutMessage.value = ''), 3000);
  }
};

const confirmCheckIn = async () => {
  try {
    const response = await apiService.checkIn();
    if (response.data.data.status === 'ACTIVE') {
      isCheckIn.value = true;
      showCheckInPopup.value = false;
      const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      displayMessage('checkIn', `출근 완료 (${currentTime})`);
    } else {
      checkInError.value = true;
    }
  } catch (error) { // eslint-disable-line no-unused-vars
    checkInError.value = true;
  }
};


const cancelCheckIn = () => {
  showCheckInPopup.value = false;
};

const confirmCheckOut = async () => {
  try {
    const response = await apiService.checkOut();
    if (response.data.data.status === 'INACTIVE') {
      isCheckIn.value = false;
      showCheckOutPopup.value = false;
      const currentTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      displayMessage('checkOut', `퇴근 완료 (${currentTime})`);
    } else {
      checkOutError.value = true;
    }
  } catch (error) { // eslint-disable-line no-unused-vars
    checkOutError.value = true;
  }
};

const cancelCheckOut = () => {
  showCheckOutPopup.value = false;
};

onMounted(() => {
  if (showSidebar.value) {
    getUserNameFromToken();
    checkInStatus();
  }
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

/* 호버 효과 고정 */
.dropdown-title.active {
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
  transition: background-color 0.3s ease;
}

.dropdown-content a.router-link-active {
  background-color: #ddd;
  border-radius: 4px;

}

.dropdown-content a:hover {
  background-color: #ddd;
  border-radius: 4px;
}

.attendance-btn {
  margin-bottom: 20px;
  margin-left: 60px;
  align-items: center;
  align-content: center;
}

.in-btn {
  width: 100px;
  height: 30px;
}

.out-btn {
  width: 100px;
  height: 30px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  width: 300px;
  height: 100px;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.popup-content button {
  margin: 10px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.confirm-btn {
  background-color: #3F72AF;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.target-role {
  font-weight: bold;
}

.check-in-message,
.check-out-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #3F72AF;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  z-index: 1000;
}
</style>