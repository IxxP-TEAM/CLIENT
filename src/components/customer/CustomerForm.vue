<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ isEditMode ? '고객사 수정' : '고객사 등록' }}</h2>
      <form @submit.prevent="handleSubmit" class="grid-form">
        <!-- 각 필드를 표시 -->
        <div class="grid-item">
          <label for="customerName">고객사 이름</label>
          <input v-model="formData.customerName" type="text" id="customerName" required />
        </div>
        <div class="grid-item">
          <label for="customerPhone">고객사 전화번호</label>
          <input v-model="formData.customerPhone" type="text" id="customerPhone" required />
        </div>
        <div class="grid-item">
          <label for="customerAddress">고객사 주소</label>
          <input v-model="formData.customerAddress" type="text" id="customerAddress" required />
        </div>
        <div class="grid-item">
          <label for="customerAdddetail">고객사 상세주소</label>
          <input v-model="formData.customerAdddetail" type="text" id="customerAdddetail" required />
        </div>
        <div class="grid-item">
          <label for="customerPersonName">담당자 이름</label>
          <input v-model="formData.customerPersonName" type="text" id="customerPersonName" required />
        </div>
        <div class="grid-item">
          <label for="customerPersonPhone">담당자 전화번호</label>
          <input v-model="formData.customerPersonPhone" type="text" id="customerPersonPhone" required />
        </div>
        <div class="grid-item">
          <label for="customerPersonEmail">담당자 이메일</label>
          <input v-model="formData.customerPersonEmail" type="email" id="customerPersonEmail" required />
        </div>
        <div class="grid-item">
          <label for="registrationNumber">사업자등록번호</label>
          <input v-model="formData.registrationNumber" type="text" id="registrationNumber" required />
        </div>
        <div class="grid-item">
          <label for="customerStatus">고객사 상태</label>
          <select v-model="formData.customerStatus" id="customerStatus" required>
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">비활성</option>
          </select>
        </div>
        <div class="grid-item">
          <label for="customerSdate">고객사 시작일</label>
          <input v-model="formData.customerSdate" type="date" id="customerSdate" required />
        </div>

        <div class="button-group">
          <button type="submit">{{ isEditMode ? '수정' : '등록' }}</button>
          <button type="button" @click="close">취소</button>
        </div>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService';

export default {
  props: {
    customerData: {
      type: Object,
      default: () => ({}),
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: { ...this.customerData }, // formData 초기화
      message: '',
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.isEditMode) {
          // 수정 모드일 때 API 호출
          await apiService.updateCustomer(this.formData.customerId, this.formData);
          this.message = '수정 성공';
        } else {
          // 등록 모드일 때 API 호출
          await apiService.createCustomer(this.formData);
          this.message = '등록 성공';
        }
        this.$emit('registered');
        this.close();
      } catch (error) {
        console.error("오류:", error);
        this.message = this.isEditMode ? '수정 실패' : '등록 실패';
      }
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
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
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.button-group {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

input, select {
  padding: 12px;
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
  width: 48%;
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
