<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <h3>급여 상세 내역</h3>
            <div class="detail-info">
                <div v-if="!isEditing">
                    <div v-if="payDetails">
                        <p><strong>이름:</strong> {{ payDetails.username }}</p>
                        <p><strong>부서</strong>{{ payDetails.department }}</p>
                        <p><strong>날짜</strong>{{ payDetails.jobTitle }}</p>
                        <p><strong>지급 일자</strong>{{ payDetails.bonus }}</p>
                        <p><strong>기본급</strong>{{ payDetails.baseSalary }}</p>
                        <p><strong>소득세</strong>{{ payDetails.incomeTax }}</p>
                        <p><strong>국민연금</strong>{{ payDetails.nationalPension }}</p>
                        <p><strong>건강보험</strong>{{ payDetails.healthInsurance }}</p>
                        <p><strong>고용보험</strong>{{ payDetails.employmentInsurance }}</p>
                        <p><strong>야간수당</strong>{{ payDetails.overtimePay }}</p>
                        <p><strong>보너스</strong>{{ payDetails.bonus }}</p>
                        <p><strong>지방소득세</strong>{{ payDetails.localIncomeTax }}</p>
                    </div>
                    <div class="button-group">
                        <button @click="startEditing">수정하기</button>
                        <button @click="$emit('close')">닫기</button>
                    </div>
                </div>
                <div v-else>
                    <h3>급여 내역 변경</h3>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        payDetails: Object,
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

.modal-content::-webkit-scrollbar {
    display: none;
}

.modal-content {
    -ms-overflow-style: none;
    scrollbar-width: none;
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

.detail-info p {
    margin: 0;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #333;
}
</style>