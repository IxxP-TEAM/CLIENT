<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">X</button>
      <h2 class="modal-title">{{ isEditing ? '직원 수정' : '직원 상세 정보' }}</h2>

      <form v-if="isEditing" @submit.prevent="saveChanges" class="modal-form">
        <label for="email">이메일</label>
        <input type="email" v-model="editableUser.email" required />

        <label for="name">이름</label>
        <input type="text" v-model="editableUser.name" required />

        <label for="address">주소</label>
        <input type="text" v-model="editableUser.address" placeholder="주소" required />

        <label for="department">부서</label>
        <select v-model="editableUser.department" required>
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
        <input type="date" v-model="editableUser.birth" readonly />

        <label for="userPhone">전화번호</label>
        <input type="tel" v-model="editableUser.userPhone" required />

        <label for="hireDate">입사일</label>
        <input type="date" v-model="editableUser.hireDate" readonly />

        <label for="jobTitle">직책</label>
        <select v-model="editableUser.jobTitle" required>
          <option value="사원">사원</option>
          <option value="대표">대표</option>
        </select>

        <label for="userStatus">상태</label>
        <select v-model="editableUser.userStatus" required>
          <option value="재직">재직</option>
          <option value="퇴사">퇴사</option>
        </select>

        <div class="button-group">
          <button type="submit" class="submit-button">저장</button>
          <button type="button" @click="cancelEdit" class="cancel-button">취소</button>
        </div>
      </form>

      <div v-else class="modal-form">
        <p><strong>이메일:</strong> {{ user.email }}</p>
        <p><strong>이름:</strong> {{ user.name }}</p>
        <p><strong>주소:</strong> {{ user.address }}</p>
        <p><strong>부서:</strong> {{ user.department }}</p>
        <p><strong>생년월일:</strong> {{ user.birth }}</p>
        <p><strong>전화번호:</strong> {{ user.userPhone }}</p>
        <p><strong>입사일:</strong> {{ user.hireDate }}</p>
        <p><strong>직책:</strong> {{ user.jobTitle }}</p>
        <p><strong>상태:</strong> {{ user.userStatus }}</p>

        <button @click="toggleEdit" class="edit-button">수정</button>
      </div>

      <p v-if="errorMessage" class="response-message error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="response-message success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService';

export default {
  props: {
    isVisible: Boolean,
    closeModal: Function,
    user: Object
  },
  data() {
    return {
      isEditing: false,
      editableUser: {
        ...this.user,
        jobtitle: this.user.jobtitle,
        status: this.user.status
      },
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = true;
    },
    async saveChanges() {
      try {
        const dataToSend = JSON.parse(JSON.stringify(this.editableUser));
        console.log('저장할 데이터:', dataToSend);
        const response = await apiService.updateUser(dataToSend);
        console.log('응답 데이터:', response);

        // 응답에서 message와 data 분리
        if (response.data.code === "200") {
          this.successMessage = response.data.message || '수정이 완료되었습니다.';
          this.$emit('updateUser', this.editableUser); // 사용자 데이터 업데이트
          this.isEditing = false;
          this.closeModal();
        } else {
          this.errorMessage = '수정에 실패했습니다. 다시 시도해 주세요.';
        }
      } catch (error) {
        this.errorMessage = '수정에 실패했습니다. 다시 시도해 주세요.';
        console.error(error);
      }
    },
    cancelEdit() {
      this.editableUser = { ...this.user };
      this.isEditing = false;
    }
  },
  watch: {
    user(newVal) {
      this.editableUser = { ...newVal };
    }
  },
  created() {
    this.editableUser = { ...this.user };
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
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

label {
  font-weight: bold;
  margin-top: 10px;
  padding-top: 5px;
}

input,
select {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.edit-button {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover,
.edit-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 50%;
}

.submit-button {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 50%;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: #000;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 1000;
  margin-top: 13px;
}

.close-button:hover {
  color: #0056b3;
}

.response-message {
  text-align: center;
  margin-top: 15px;
}

.error {
  color: red;
}

.success {
  color: green;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
</style>