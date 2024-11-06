<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="modal-title">직원 등록</h2> 
      <button @click="closeModal" class="close-button">닫기</button>
      <form @submit.prevent="registerUser" class="modal-form">
        <label for="email">이메일</label>
        <input type="email" v-model="formData.email" required />

        <label for="name">이름</label>
        <input type="text" v-model="formData.name" required />

        <label for="address">주소 </label>
        <input type="text" v-model="formData.address" placeholder="우편번호" required />

        <label for="department">부서</label>
        <select v-model="formData.department" required >
          <option value="영업1팀">영업1팀</option>
          <option value="영업2팀">영업2팀</option>
          <option value="영업3팀">영업3팀</option>
          <option value="인사1팀">인사1팀</option>
          <option value="인사2팀">인사2팀</option>
          <option value="인사3팀">인사3팀</option>
          <option value="생산1팀">생산1팀</option>
          <option value="생산2팀">생산2팀</option>
          <option value="생산3팀">생산3팀</option>
        </select>

        <label for="birth">생년월일</label>
        <input type="date" v-model="formData.birth" required />

        <label for="userPhone">전화번호</label>
        <input type="tel" v-model="formData.userPhone" required />

        <label for="hireDate">입사일</label>
        <input type="date" v-model="formData.hireDate" required />

        <label for="jobTitle">직책</label>
        <select type="text" v-model="formData.jobTitle" required >
          <option value="사원">사원</option>
          <option value="대표">대표</option>
        </select>

        <label for="userStatus">상태</label>
        <select v-model="formData.userStatus" required>
          <option value="재직">재직</option>
          <option value="퇴사">퇴사</option>
        </select>

        <button type="submit" class="submit-button">직원 등록</button>
      </form>
      <p v-if="responseMessage" class="response-message">{{ responseMessage }}</p>
      </div>
    </div>
      <!-- 성공 메시지 모달 -->
    <div v-if="isSuccessModalVisible" class="modal-overlay" @click.self="closeSuccessModal">
      <div class="modal-content">
        <h2 class="modal-title">직원 등록 성공!</h2>
        <p class="response-message">직원 등록이 성공적으로 완료되었습니다.</p>
        <button @click="closeSuccessModal" class="close-button">닫기</button>
      </div>
    </div>
</template>

<script>
import apiService from '@/api/apiService';

export default {
  props: {
    isVisible: Boolean,
    closeModal: Function,
  },
  data() {
    return {
      formData: {
        email: '',
        name: '',
        address: '',
        birth: '',
        userPhone: '',
        hireDate: '',
        jobTitle: '',
        department: '',
        userStatus: '',
      },
      responseMessage: '',
      showPostcodeModal: false,
      isSuccessModalVisible: false,
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await apiService.registerUser(this.formData);
        this.responseMessage = response.data.data;
        this.isSuccessModalVisible = true;
        this.closeModal();
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          this.responseMessage = error.response.data.message;  
        } else {
        this.responseMessage = '회원가입 실패';
        }
      }
    },
    closeSuccessModal() {
      this.isSuccessModalVisible = false;
    }
  }
};
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 80vh; /* 최대 높이를 80%로 설정 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
}

.modal-title {
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
}

.modal-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
  font-weight: bold;
}

input, select {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:focus, select:focus {
  border-color: #007BFF;
  outline: none;
}

.address-fieldset {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

.submit-button {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.close-button {
  background-color: transparent;
  color: #007BFF;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  margin-top: 17px;
}

.close-button:hover {
  text-decoration: underline;
}

.response-message {
  margin-top: 10px;
  color: #0056b3;
  text-align: center;
}

.zipcode-container {
  display: flex;
  align-items: center;
}

.zipcode-container input {
  flex-grow: 1;
  margin-right: 10px;
}

.postcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.postcode-modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.postcode-modal-content h3 {
  margin-bottom: 10px;
}

.postcode-modal-content ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.postcode-modal-content li {
  cursor: pointer;
  padding: 5px;
  border-bottom: 1px solid #ccc;
}

.postcode-modal-content li:hover {
  background-color: #f0f0f0;
}
</style>