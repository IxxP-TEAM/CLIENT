<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <aside v-if="showSidebar" class="sidebar">
    <div class="logo">
      <img src="/src/assets/logo.png" alt="IXXP ERP Logo" />
    </div>

    <!-- 로그인 정보 섹션 -->
    <div class="login-info">
      <p>로그인 사용자: {{ userName }}</p>
      <p class="target-role">{{ userRole === 'ROLE_ADMIN' ? '관리자' : '일반 사용자' }}</p>
    </div>

    <nav>
      <!-- 출근/퇴근 버튼 -->
      <div class="attendance-btn">
        <button v-if="!isCheckIn" @click="openCheckInPopup" class="in-btn">출근하기</button>
        <button v-else @click="openCheckOutPopup" class="out-btn">퇴근하기</button>
      </div>

      <!-- 관리자 메뉴 -->
      <div v-if="userRole === 'ROLE_ADMIN'" class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown2')">
          인사관리
        </div>
        <div v-if="isDropdownOpen.dropdown2" class="dropdown-content">
          <router-link to="/empList">직원 목록</router-link>
          <router-link to="/create-emp">직원 등록</router-link>
          <router-link to="/leave">휴가 관리</router-link>
          <router-link to="/late">지각/조퇴 관리</router-link>
        </div>
        <div class="dropdown-title" @click="toggleDropdown('dropdown3')">
          급여관리
        </div>
        <div v-if="isDropdownOpen.dropdown3" class="dropdown-content">
          <router-link to="/att-create">급여 등록</router-link>
          <router-link to="/att-list">급여 목록</router-link>
          <router-link to="/att-specification">급여 명세서 관리</router-link>
        </div>
      </div>

      <!-- 일반 사용자 메뉴 -->
      <div v-if="userRole === 'ROLE_USER'" class="dropdown">
        <div class="dropdown-title" @click="toggleDropdown('dropdown1')">
          영업 관리
        </div>
        <div v-if="isDropdownOpen.dropdown1" class="dropdown-content">
          <router-link to="/customer-list">고객사 목록</router-link>
          <router-link to="/order-list">판매 목록</router-link>
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

  <!-- 퇴근 확인 팝업 -->
  <div v-show="showCheckOutPopup" class="popup">
    <div class="popup-content">
      <p>퇴근하시겠습니까?</p>
      <button @click="confirmCheckOut" class="confirm-btn">확인</button>
      <button @click="cancelCheckOut" class="cancel-btn">취소</button>
      <p v-if="checkOutError" class="error-message">퇴근하기 실패</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
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

const isDropdownOpen = ref({

  dropdown1: false, // 영업관리
  dropdown2: false, // 인사관리
  dropdown3: false, // 급여관리
  dropdown4: false, // 제품 관리
  dropdown5: false, // 매출 개요
  
});

// 사이드바 표시 여부를 결정하는 computed property
const showSidebar = computed(() => {
  return route.path !== '/login';
});

// 드롭다운 토글 함수
const toggleDropdown = (dropdown) => {
  isDropdownOpen.value[dropdown] = !isDropdownOpen.value[dropdown];
};

// 로그인한 사용자 이름 가져오는 함수
const getUserNameFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken = VueJwtDecode.decode(token);
    userName.value = decodedToken.username;
    userRole.value = decodedToken.role;
    console.log(userName.value);
  }
};

// 출근 상태 체크 API 호출
const checkInStatus = async () => {
  try {
    const response = await apiService.checkInStatus();
    console.log('출근 상태:', response.data.data.status);
    isCheckIn.value = response.data.data.status;
  } catch (error) {
    console.error('출근 상태 조회 실패', error);
  }
};

// 출근 확인 팝업 열기
const openCheckInPopup = () => {
  showCheckInPopup.value = true;
  checkInError.value = false;
};

// 퇴근 확인 팝업 열기
const openCheckOutPopup = () => {
  showCheckOutPopup.value = true;
  checkOutError.value = false;
};

// 출근 확인 버튼 클릭 시 처리
const confirmCheckIn = async () => {
  try {
    const response = await apiService.checkIn(); // 출근 처리 API 호출
    if (response.data.data.status === 'ACTIVE') {
      isCheckIn.value = true; // 출근 성공
      showCheckInPopup.value = false; // 팝업 닫기
    } else {
      checkInError.value = true; // 출근 실패 시 오류 메시지 표시
    }
  } catch (error) { // eslint-disable-line no-unused-vars
    checkInError.value = true; // 서버 에러로 실패 시 오류 메시지 표시
  }
};

// 출근 취소 버튼 클릭 시 처리
const cancelCheckIn = () => {
  showCheckInPopup.value = false; // 팝업 닫기
};

// 퇴근 확인 버튼 클릭 시 처리
const confirmCheckOut = async () => {
  try {
    const response = await apiService.checkOut(); // 퇴근 처리 API 호출
    if (response.data.data.status === 'INACTIVE') {
      isCheckIn.value = false; // 퇴근 성공
      showCheckOutPopup.value = false; // 팝업 닫기
    } else {
      checkOutError.value = true; // 퇴근 실패 시 오류 메시지 표시
    }
  } catch (error) { // eslint-disable-line no-unused-vars
    checkOutError.value = true; // 서버 에러로 실패 시 오류 메시지 표시
  }
};

// 퇴근 취소 버튼 클릭 시 처리
const cancelCheckOut = () => {
  showCheckOutPopup.value = false; // 팝업 닫기
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

.attendance-btn {
  /* margin-top: 13px; */
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
</style>