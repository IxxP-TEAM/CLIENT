<template>
  <div>
    <!-- 고객사 등록 버튼 -->
    <button @click="openForm">고객사 등록</button>

    <!-- 모달 형태의 작성 폼 -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content">
        <h2>고객사 등록</h2>
        <form @submit.prevent="handleSubmit" class="grid-form">
          <div class="grid-item">
            <label for="name">고객사 이름</label>
            <input type="text" id="name" v-model="customerData.customerName" required />
          </div>

          <div class="grid-item">
            <label for="phone">고객사 전화번호</label>
            <input type="text" id="phone" v-model="customerData.customerPhone" required />
          </div>

          <div class="grid-item">
            <label for="address">고객사 주소</label>
            <input type="text" id="address" v-model="customerData.customerAddress" required />
          </div>

          <div class="grid-item">
            <label for="address-detail">고객사 상세주소</label>
            <input type="text" id="address-detail" v-model="customerData.customerAdddetail" required />
          </div>

          <div class="grid-item">
            <label for="contact">담당자 이름</label>
            <input type="text" id="contact" v-model="customerData.customerPersonName" required />
          </div>

          <div class="grid-item">
            <label for="contactPhone">담당자 전화번호</label>
            <input type="text" id="contactPhone" v-model="customerData.customerPersonPhone" required />
          </div>

          <div class="grid-item">
            <label for="contactEmail">담당자 이메일</label>
            <input type="email" id="contactEmail" v-model="customerData.customerPersonEmail" required />
          </div>

          <div class="grid-item">
            <label for="registrationNumber">사업자등록번호</label>
            <input type="text" id="registrationNumber" v-model="customerData.registrationNumber" required />
          </div>

          <div class="grid-item">
            <label for="status">고객사 상태</label>
            <select id="status" v-model="customerData.customerStatus" required>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>

          <div class="grid-item">
            <label for="startDate">고객사 시작일</label>
            <input type="date" id="startDate" v-model="customerData.customerSdate" required />
          </div>

          <!-- 버튼 영역을 전체 너비로 차지하도록 설정 -->
          <div class="button-group">
            <button type="submit">등록</button>
            <button type="button" @click="closeForm">취소</button>
          </div>
        </form>

        <p v-if="message" class="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import apiService from '@/api/apiService';

export default {
  name: 'CustomerForm',
  data() {
    return {
      showForm: false, // 폼 모달의 표시 여부
      customerData: {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        customerAdddetail: '',
        customerPersonName: '',
        customerPersonPhone: '',
        customerPersonEmail: '',
        registrationNumber: '',
        customerStatus: 'ACTIVE',
        customerSdate: '',
        userId: 1,
      },
      message: '', // 성공 또는 실패 메시지
    };
  },
  methods: {
    openForm() {
      this.showForm = true; // 폼 모달 열기
    },
    closeForm() {
      this.showForm = false; // 폼 모달 닫기
      this.resetForm();
    },
    async handleSubmit() {
      try {
        await apiService.createCustomer(this.customerData);
        this.message = '고객사가 성공적으로 등록되었습니다.';
        this.closeForm(); // 폼 닫기
      } catch (error) {
        console.error(error);
        this.message = '등록 중 오류가 발생했습니다.';
      }
    },
    resetForm() {
      this.customerData = {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        customerAdddetail: '',
        customerPersonName: '',
        customerPersonPhone: '',
        customerPersonEmail: '',
        registrationNumber: '',
        customerStatus: 'ACTIVE',
        customerSdate: '',
        userId: 1,
      };
    },
  },
};
</script>

<style scoped>
/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 레이아웃 */
  gap: 20px; /* 그리드 항목 간 간격을 넓힘 */
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.button-group {
  grid-column: span 2; /* 버튼은 두 칸을 차지 */
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

input, select {
  padding: 12px; /* 필드 크기 넓힘 */
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"],
button[type="button"] {
  background-color: #3F72AF;
  color: white;
  border: none;
  border-radius: 4px;
  width: 48%; /* 버튼 간격 조정 */
  padding: 12px;
  cursor: pointer;
}

button[type="button"] {
  background-color: #f44336;
}

button[type="submit"]:hover {
  background-color: #3F72AF;
}

button[type="button"]:hover {
  background-color: #e53935;
}

.message {
  color: #3F72AF;
  margin-top: 15px;
  text-align: center;
}
</style>
