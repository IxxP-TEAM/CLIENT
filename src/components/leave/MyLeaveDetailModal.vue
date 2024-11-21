<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h2>휴가 세부 정보</h2>
            <div>
                <!-- 상세 정보 조회 -->
                <div v-if="leaveDetails">
                    <p><strong>이름:</strong> {{ leaveDetails.username }}</p>
                    <p><strong>휴가명:</strong> {{ leaveDetails.leaveType }}</p>
                    <p><strong>상태:</strong> {{ leaveDetails.approvalStatus }}</p>
                    <p><strong>시작일자:</strong> {{ formattedStartDate }}</p>
                    <p><strong>종료일자:</strong> {{ formattedEndDate }}</p>
                    <p><strong>휴가 사유:</strong> {{ leaveDetails.reason }}</p>
                    <p v-if="leaveDetails.approvalStatus === '거절'">
                        <strong>거절 사유:</strong> {{ leaveDetails.inactiveReason }}
                    </p>
                </div>
                <div class="button-group">
                    <button @click="$emit('close')">닫기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
        },
    },
    methods: {
        // 날짜 포맷
        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
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

button:hover {
    background-color: #2f5c92;
}
</style>