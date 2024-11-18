<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2>휴가 세부 정보</h2>
            <div v-if="!isEditing">
                <!-- 상세 정보 조회 -->
                <div v-if="leaveDetails">
                    <p><strong>이름:</strong> {{ leaveDetails.username }}</p>
                    <p><strong>휴가명:</strong> {{ leaveDetails.leaveType }}</p>
                    <p><strong>상태:</strong> {{ localLeaveDetails.approvalStatus }}</p>
                    <p><strong>시작일자:</strong> {{ formattedStartDate }}</p>
                    <p><strong>종료일자:</strong> {{ formattedEndDate }}</p>
                    <p><strong>휴가 사유:</strong> {{ leaveDetails.reason }}</p>
                    <p v-if="leaveDetails.approvalStatus === '거절'">
                        <strong>거절 사유:</strong> {{ leaveDetails.inactiveReason }}
                    </p>
                </div>
                <div class="button-group">
                    <button @click="startEditing">수정하기</button>
                    <button @click="$emit('close')">닫기</button>
                </div>
            </div>
            <div v-else>
                <!-- 수정 폼 -->
                <h3>상태 변경</h3>
                <div>
                    <button @click="approveLeave">승인</button>
                    <button @click="showRejectForm">거절</button>
                </div>
                <div v-if="isRejecting" class="reject-form">
                    <textarea v-model="refuseReason" placeholder="거절 사유를 입력하세요"></textarea>
                    <button @click="submitReject">거절 제출</button>
                </div>
                <div class="button-group">
                    <button @click="cancelEditing">취소</button>
                    <button @click="$emit('close')">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import apiService from '@/api/apiService';
export default {
    props: {
        leaveDetails: Object,
    },
    computed: {
        formattedStartDate() {
            return this.formatDate(this.leaveDetails.startDate);
        },
        formattedEndDate() {
            return this.formatDate(this.leaveDetails.endDate);
        }
    },
    data() {
        return {
            localLeaveDetails: { ...this.leaveDetails },
            isEditing: false,
            isRejecting: false,
            refuseReason: "",
        };
    },
    watch: {
        leaveDetails: {
            immediate: true,
            handler(newDetails) {
                this.localLeaveDetails = { ...newDetails };
            },
        },
    },
    methods: {
        // 날짜포맷
        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // 수정 시작
        startEditing() {
            this.isEditing = true;
        },
        // 수정 취소
        cancelEditing() {
            this.isEditing = false;
            this.isRejecting = false;
            this.refuseReason = "";
        },
        // 승인 처리
        async approveLeave() {
            try {
                await apiService.approvalLeave(this.leaveDetails.leaveId);
                const response = await apiService.fetchLeaveDetails(this.leaveDetails.leaveId);

                this.localLeaveDetails = { ...response.data.data };

                this.$emit("refresh-data");

                this.isEditing = false;
            } catch (error) {
                console.error("승인 처리 실패:", error);
            }
        },
        showRejectForm() {
            this.isRejecting = true;
        },
        // 거절 제출
        async submitReject() {
            if (!this.refuseReason) {
                alert("거절 사유를 입력해주세요.");
                return;
            }

            try {
                await apiService.refusalLeave(this.leaveDetails.leaveId, {
                    refuseReason: this.refuseReason,
                });

                const response = await apiService.fetchLeaveDetails(this.leaveDetails.leaveId);
                this.localLeaveDetails = { ...response.data.data };

                this.$emit("refresh-data");

                this.isEditing = false;
                this.isRejecting = false;
                this.refuseReason = "";
            } catch (error) {
                console.error("거절 실패", error);
            }
        },
        async fetchLeaveDetails() {
            try {
                const response = await apiService.fetchLeaveDetails(this.leaveDetails.leaveId);
                console.log('수정된 서버에서 받은 데이터', response);
                this.localLeaveDetails = response.data.data;
            } catch (error) {
                console.error("상세정보 조회 실패:", error);
            }
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
    width: 800px;
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

button {
    background-color: #3f72af;
    color: white;
    border: none;
    border-radius: 4px;
    width: 150px;
    padding: 12px;
    cursor: pointer;
    font-size: 16px;
}

button:nth-child(1) {
    background-color: gray;
    color: white;
    border: 2px solid gray;
}

button:nth-child(1):hover {
    background-color: rgb(80, 80, 80);
}


.reject-form {
    margin-top: 20px;
}

textarea {
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
}
</style>