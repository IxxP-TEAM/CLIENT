<template>
    <div class="login-container">
        <div class="logo-class">
            <img class="logo" src="../assets/image.png">
        </div>
        <form @submit.prevent="handleLogin">
            <input type="text" v-model="connId" placeholder="아이디" required />
            <input type="password" v-model="password" placeholder="비밀번호" required />
            <button type="submit">로그인</button>
        </form>
        <div class="find-pw">
            <span @click="goToResetPassword">비밀번호 재설정</span>
        </div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
</template>

<script>
import { login } from '../api/auth';

export default {
    name: 'UserLogin',
    data() {
        return {
            connId: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await login(this.connId, this.password);
                console.log('로그인 성공:', response);
                this.$router.push('/home');
            } catch (error) {
                this.errorMessage = '로그인 실패. 다시 시도하세요.';
                console.error(error);
            }
        },
        goToResetPassword() {
            this.$router.push('/resetPassword');
        }
    },
};
</script>

<style scoped>
.login-container {
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
}


form {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

input {
    margin: 15px 0;
    padding: 8px 0;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
    margin-top: 40px;
    margin-bottom: 20px;
}

input:focus {
    border-bottom-color: #3F72AF;
}

button {
    padding: 10px 20px;
    width: 140px;
    margin-top: 40px;
    background-color: #fff;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

button:hover {
    background-color: #3F72AF;
}

.error {
    color: red;
    margin-top: 10px;
    font-size: 14px;
}

.logo-class {
    margin-bottom: 20px;
    padding-top: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.logo {
    width: 300px;
    height: auto;
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