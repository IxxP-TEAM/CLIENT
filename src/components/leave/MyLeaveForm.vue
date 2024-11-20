<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <form @submit.prevent="handleSubmit" class="grid-form">
                <div class="grid-item">
                    <label for="username">이름</label>
                    <p>{{ selectedEmployeeName }}</p>
                </div>
                <div class="grid-item">
                    <label for="leaveType">휴가 타입</label>
                    <select v-model="formData.leaveType" id="leaveType" required>
                        <option value="" disabled selected>휴가 타입을 선택하세요</option>
                        <option value="기본연차">기본연차</option>
                        <option value="반차">반차</option>
                        <option value="반반차">반반차</option>
                        <option value="병가">병가</option>
                        <option value="기본연차">기본연차</option>
                        <option value="겨울휴가">겨울휴가</option>
                        <option value="여름휴가">여름휴가</option>
                        <option value="휴무">휴무</option>
                    </select>
                </div>
                <div class="grid-item">
                    <label for="startDate">휴가 시작 날짜</label>
                    <input v-model="formData.startDate" type="date" id="startDate" required />
                </div>

                <div class="grid-item">
                    <label for="endDate">휴가 종료 날짜</label>
                    <input v-model="formData.endDate" type="date" id="endDate" required />
                </div>

                <div v-if="dateError" class="error-message">
                    종료 날짜는 시작 날짜 이후여야 합니다.
                </div>

                <div class="grid-item">
                    <label for="reason">휴가 사유</label>
                    <textarea v-model="formData.reason" id="reason" placeholder="휴가 사유를 입력하세요" required></textarea>
                </div>

                <div class="button-group">
                    <button type="submit">제출</button>
                    <button type="button" @click="close">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import VueJwtDecode from 'vue-jwt-decode'
import apiService from '@/api/apiService'

export default {
    props: {
        isEditMode: {
            type: Boolean,
            default: false,
        },
        initialData: {
            type: Object,
            default: () => ({
                userName: '',
                reason: '',
                leaveType: '',
                startDate: '',
                endDate: '',
            }),
        },
    },
    data() {
        return {
            formData: { ...this.initialData },
            selectedEmployeeName: '',
            dateError: false,
        };
    },
    methods: {
        validateDates() {
            const startDate = new Date(this.formData.startDate);
            const endDate = new Date(this.formData.endDate);

            if (startDate > endDate) {
                this.dateError = true;
            } else {
                this.dateError = false;
            }
        },
        async handleSubmit() {
            try {
                const startDate = new Date(this.formData.startDate);
                const endDate = new Date(this.formData.endDate);

                const formData = {
                    ...this.formData,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                };

                const response = await apiService.createLeave(formData);
                console.log('휴가 신청 성공:', response.data);
                this.$emit('submit', { ...this.formData });
                this.close();
            } catch (error) {
                console.error('휴가 신청 실패:', error);
            }
        },
        close() {
            this.$emit('close');
        },
        getUserNameFromToken() {
            const token = localStorage.getItem('accessToken')
            if (token) {
                try {
                    const decodedToken = VueJwtDecode.decode(token)
                    this.selectedEmployeeName = decodedToken.username || '이름 정보 없음'
                } catch (error) {
                    console.error('토큰 디코딩 오류:', error)
                    this.selectedEmployeeName = '디코딩 실패'
                }
            } else {
                this.selectedEmployeeName = '로그인 필요'
            }
        },
        resetFormData() {
            this.formData = {
                userName: '',
                reason: '',
                leaveType: '',
                startDate: '',
                endDate: '',
            };
        }
    },
    watch: {
        'formData.startDate': 'validateDates',
        'formData.endDate': 'validateDates',
    },
    mounted() {
        this.getUserNameFromToken()
        if (this.isEditMode) {
            this.formData = { ...this.customerData }
        } else {
            this.resetFormData()
        }
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
    width: 800px;
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
}

.error-message {
    color: red;
    font-size: 0.9em;
}

.modal-content::-webkit-scrollbar {
    display: none;
}

.modal-content {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.grid-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.grid-item {
    display: flex;
    flex-direction: column;
}

.full-width {
    grid-column: span 2;
}

.button-group {
    grid-column: span 2;
    display: flex;
    justify-content: center;
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

button[type='submit'] {
    background-color: #3f72af;
    color: white;
    border: none;
    border-radius: 4px;
    width: 150px;
    padding: 12px;
    cursor: pointer;
}

button[type='submit']:hover {
    background-color: #2c5987;
}

button[type='button'] {
    background-color: gray;
    color: white;
    border: 2px solid gray;
    border-radius: 4px;
    width: 150px;
    padding: 12px;
    cursor: pointer;
}

button[type='button']:hover {
    background-color: rgb(80, 80, 80);
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