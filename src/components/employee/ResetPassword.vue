<template>
  <div class="reset-password-container">
    <h2>비밀번호 재설정</h2>

    <!-- 아이디 입력 및 인증번호 입력 -->
    <div v-if="!isCodeSent">
      <div class="input-container-code">
        <input type="text" v-model="email" placeholder="이메일" required />
      </div>
      <div class="button-container">
        <button @click="sendVerificationCode">인증 코드 발송</button>
      </div>
    </div>

    <!-- 인증번호 확인 및 비밀번호 설정 -->
    <div v-if="isCodeSent && !isPasswordReset">
      <div class="input-container-reset">
        <input type="text" v-model="code" placeholder="인증 코드" required />
        <input type="password" v-model="newPassword" placeholder="새 비밀번호" required />
      </div>
      <div class="button-container">
        <button @click="verifyAndResetPassword">비밀번호 재설정</button>
      </div>
    </div>

    <!-- 성공/실패 메시지 -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
  </div>
</template>

<script>
import apiService from '@/api/apiService';
import router from '@/router';


export default {
  data() {
    return {
      email: '',               // 사용자의 이메일
      code: '',                // 인증 코드
      newPassword: '',         // 새 비밀번호
      isCodeSent: false,       // 인증 코드 발송 여부
      isPasswordReset: false,  // 비밀번호 재설정 여부
      errorMessage: '',        // 오류 메시지
      successMessage: '',      // 성공 메시지
    };
  },
  methods: {
    // 인증 코드 발송
    async sendVerificationCode() {
      if (!this.email) {
        this.errorMessage = '이메일을 입력해주세요.';
        this.successMessage = '';
        return;
      }

      try {
        // 실제 인증 코드 발송 API 호출 (가정)
        await apiService.sendResetPassword(this.email); // 실제 API 호출 사용

        // 인증코드 발송 성공 후 알림창 띄우기
        alert("전송되었습니다!");

        // 인증 코드 발송 완료 후 상태 변경
        this.isCodeSent = true;
        this.errorMessage = ''; // 오류 메시지 초기화
      } catch (error) {
        this.errorMessage = '인증 코드 발송에 실패했습니다.';
        this.successMessage = '';
        console.error(error);
      }
    },

    // 비밀번호 유효성 검사
    isPasswordValid(password) {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
      return passwordRegex.test(password);
    },

    // 인증 코드 검증 후 비밀번호 재설정
    async verifyAndResetPassword() {
      if (!this.email || !this.code || !this.newPassword) {
        this.errorMessage = '모든 필드를 입력해주세요.';
        this.successMessage = '';
        return;
      }

      if (!this.isPasswordValid(this.newPassword)) {
        this.errorMessage = '비밀번호는 영어, 숫자, 특수문자를 포함한 최소 8자리여야 합니다.';
        this.successMessage = '';
        return;
      }

      try {
        // 이메일, 인증 코드, 새 비밀번호를 함께 서버로 전송
        const response = await apiService.resetPassword(this.email, this.code, this.newPassword);
        console.log('Response:', response);
        this.isPasswordReset = true;
        this.successMessage = '비밀번호가 성공적으로 변경되었습니다.';
        this.errorMessage = '';

        alert("비밀번호가 성공적으로 변경되었습니다. \n로그인을 진행해주세요!");
        router.push('/login');
      } catch (error) {
        this.errorMessage = '인증 코드가 유효하지 않거나, 비밀번호 재설정에 실패했습니다.';
        this.successMessage = '';
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.reset-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  margin-left: 90px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.input-container {
  width: 100%;
  /* 부모 요소의 너비를 100%로 설정 */
  max-width: 600px;
  /* 최대 너비를 지정 */
}

input {
  margin: 15px 0;
  padding: 10px 0;
  width: 400px;
  /* max-width: 500px; */
  border: none;
  border-bottom: 2px solid #ccc;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-bottom-color: #3F72AF;
}

.input-container-reset {
  margin-left: 70px;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

button {
  padding: 10px 20px;
  width: 200px;
  margin-top: 50px;
  background-color: #3F72AF;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: #3F72AF;
  color: white;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.success {
  color: green;
  margin-top: 10px;
}

.find-pw {
  padding-top: 30px;
}

.find-pw span {
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}
</style>