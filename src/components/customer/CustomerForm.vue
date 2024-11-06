<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ isEditMode ? '고객사 수정' : '고객사 등록' }}</h2>
      <form @submit.prevent="handleSubmit" class="grid-form">
        <!-- 고객사 정보 필드 -->
        <div class="grid-item">
          <label for="customerName">고객사 이름</label>
          <input
            v-model="formData.customerName"
            type="text"
            id="customerName"
            required
          />
        </div>
        <div class="grid-item">
          <label for="customerPhone">고객사 전화번호</label>
          <input
            v-model="formData.customerPhone"
            type="text"
            id="customerPhone"
            @input="formatCustomerPhone"
            :class="{ 'invalid': !isCustomerPhoneValid && formData.customerPhone }"
            required
          />
          <p v-if="!isCustomerPhoneValid && formData.customerPhone" class="error-message">
            유효한 전화번호 형식이 아닙니다.
          </p>
        </div>
        <div class="grid-item">
          <label for="customerAddress">고객사 주소</label>
          <input
            v-model="formData.customerAddress"
            type="text"
            id="customerAddress"
            required
          />
        </div>
        <div class="grid-item">
          <label for="customerAdddetail">고객사 상세주소</label>
          <input
            v-model="formData.customerAdddetail"
            type="text"
            id="customerAdddetail"
            required
          />
        </div>

        <div class="grid-item">
          <label for="customerPersonName">고객사 담당자 이름</label>
          <input
            v-model="formData.customerPersonName"
            type="text"
            id="customerPersonName"
            required
          />
        </div>
        <div class="grid-item">
          <label for="customerPersonPhone">고객사 담당자 전화번호</label>
          <input
            v-model="formData.customerPersonPhone"
            type="text"
            id="customerPersonPhone"
            @input="formatCustomerPersonPhone"
            :class="{ 'invalid': !isCustomerPersonPhoneValid && formData.customerPersonPhone }"
            required
          />
          <p v-if="!isCustomerPersonPhoneValid && formData.customerPersonPhone" class="error-message">
            유효한 담당자 전화번호 형식이 아닙니다.
          </p>
        </div>
        <div class="grid-item">
          <label for="customerPersonEmail">고객사 담당자 이메일</label>
          <input
            v-model="formData.customerPersonEmail"
            type="email"
            id="customerPersonEmail"
            required
          />
        </div>

        <div class="grid-item">
          <label for="registrationNumber">사업자등록번호</label>
          <input
            v-model="formData.registrationNumber"
            type="text"
            id="registrationNumber"
            required
          />
        </div>
        <div class="grid-item">
          <label for="customerStatus">고객사 상태</label>
          <select
            v-model="formData.customerStatus"
            id="customerStatus"
            required
          >
            <option value="ACTIVE">활성</option>
            <option value="INACTIVE">비활성</option>
          </select>
        </div>
        <div class="grid-item">
          <label for="customerSdate">고객사 시작일</label>
          <input
            v-model="formData.customerSdate"
            type="date"
            id="customerSdate"
            required
          />
          <p v-if="!isCustomerSdateValid" class="error-message">현재 날짜를 초과할 수 없습니다.</p>
        </div>

        <!-- 고객사 메모 필드 추가 -->
        <div class="grid-item full-width">
          <label for="customerNote">고객사 메모</label>
          <textarea
            v-model="formData.customerNote"
            id="customerNote"
            rows="4"
          ></textarea>
        </div>

        <!-- 버튼 그룹 -->
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
import apiService from '@/api/apiService'
import VueJwtDecode from 'vue-jwt-decode'

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
  computed: {
    isCustomerPhoneValid() {
      return this.validatePhoneNumber(this.formData.customerPhone);
    },
    isCustomerPersonPhoneValid() {
      return this.validatePersonPhoneNumber(this.formData.customerPersonPhone);
    },
    isCustomerSdateValid() {
      const today = new Date().toISOString().split('T')[0]; // 현재 날짜
      return !this.formData.customerSdate || this.formData.customerSdate <= today;
    },
  },
  data() {
    return {
      formData: {},
      message: '',
    }
  },
  mounted() {
    this.getUserNameFromToken() // 로그인한 사용자 이름 가져오기
    if (this.isEditMode) {
      this.formData = { ...this.customerData }
    } else {
      this.resetFormData()
    }
  },
  methods: {
    async handleSubmit() {
  if (!this.isCustomerPhoneValid || !this.isCustomerPersonPhoneValid) {
    this.message = '전화번호 형식이 유효하지 않습니다.';
    return;
  }
  if (!this.isCustomerSdateValid) {
        this.message = '고객사 시작일은 현재 날짜를 넘을 수 없습니다.';
        return;
      }
  try {
    this.formData.userName = this.selectedEmployeeName;
    if (this.isEditMode) {
      await apiService.updateCustomer(this.formData.customerId, this.formData);
      this.message = '수정 성공';
    } else {
      await apiService.createCustomer(this.formData);
      this.message = '등록 성공';
    }
    this.$emit('registered');
    this.close();
  } catch (error) {
    console.error('오류:', error);
    this.message = this.isEditMode ? '수정 실패' : '등록 실패';
  }
},
    formatCustomerPhone() {
      this.formData.customerPhone = this.formatPhoneNumber(this.formData.customerPhone);
    },
    formatCustomerPersonPhone() {
      this.formData.customerPersonPhone = this.formatPersonPhoneNumber(this.formData.customerPersonPhone);
    },
    formatPhoneNumber(input) {
      // 숫자만 남김
      input = input.replace(/\D/g, '');

      if (input.startsWith('02')) {
        if (input.length <= 2) return input;
        if (input.length <= 6) return `${input.slice(0, 2)}-${input.slice(2)}`;
        if (input.length <= 10) return `${input.slice(0, 2)}-${input.slice(2, 6)}-${input.slice(6)}`;
      } else {
        if (input.length <= 3) return input;
        if (input.length <= 7) return `${input.slice(0, 3)}-${input.slice(3)}`;
        if (input.length <= 11) return `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
      }
      return input;
    },
    formatPersonPhoneNumber(input) {
      // 숫자만 남김
      input = input.replace(/\D/g, '');

      if (input.startsWith('010')) {
        if (input.length <= 3) return input;
        if (input.length <= 7) return `${input.slice(0, 3)}-${input.slice(3)}`;
        if (input.length <= 11) return `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
      }
      return input;
    },
    validatePhoneNumber(phoneNumber) {
      // 02-1234-1234 또는 031-1234-1234 형식 허용
      const phoneRegex = /^(02|0[3-9][0-9])-(\d{3,4})-(\d{4})$/;
      return phoneRegex.test(phoneNumber);
    },
    validatePersonPhoneNumber(phoneNumber) {
      // 010-1234-1234 형식 허용
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      return phoneRegex.test(phoneNumber);
    },
    // 토큰에서 사용자 이름 가져오는 메서드
    getUserNameFromToken() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const decodedToken = VueJwtDecode.decode(token)
          this.selectedEmployeeName = decodedToken.username || '이름 정보 없음'
          console.log('Decoded token:', decodedToken) // 토큰 구조 확인
        } catch (error) {
          console.error('토큰 디코딩 오류:', error)
          this.selectedEmployeeName = '디코딩 실패'
        }
      } else {
        this.selectedEmployeeName = '로그인 필요'
      }
    },
    close() {
      this.$emit('close')
      this.resetFormData()
    },
    resetFormData() {
      this.formData = {
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
        customerNote: '',
        userName: '', // formData에서 사용자 이름 초기화
      }
      this.selectedEmployeeName = ''
    },
  },
  watch: {
    isEditMode(newVal) {
      if (newVal) {
        this.formData = { ...this.customerData }
      } else {
        this.resetFormData()
      }
    },
  },
}
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
  width: 800px; /* 가로 너비 증가 */
  max-width: 95%;
  max-height: 90vh; /* 높이를 제한하여 스크롤 가능 */
  overflow-y: auto; /* 스크롤 활성화 */
}

/* 스크롤바를 숨기기 위한 스타일 */
.modal-content::-webkit-scrollbar {
  display: none;
}
.modal-content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열 레이아웃 */
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

.error-message {
  color: red;
  font-size: 0.9em;
}

.button-group {
  grid-column: span 2; /* 버튼 그룹 전체 너비 차지 */
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  gap: 20px;
  margin-top: 20px;
}

input,
select,
textarea {
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type='submit'],
button[type='button'] {
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 4px;
  width: 150px; /* 버튼 너비 고정 */
  padding: 12px;
  cursor: pointer;
}

button[type='button'] {
  background-color: #f44336;
}

button[type='submit']:hover {
  background-color: #3f72af;
}

button[type='button']:hover {
  background-color: #e53935;
}

.message {
  color: #3f72af;
  margin-top: 15px;
  text-align: center;
}
input.invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.9em;
}
</style>