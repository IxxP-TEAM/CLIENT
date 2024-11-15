<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">입고 등록</h3>
      <form @submit.prevent="submitInbound" class="modal-form">
        <label for="productName">제품 이름</label>
        <input
          type="text"
          id="productName"
          v-model="inboundData.productName"
          required
        />

        <label for="quantity">수량</label>
        <input
          type="number"
          id="quantity"
          v-model="inboundData.quantity"
          required
          min="1"
        />

        <label for="expirationDate">유통기한</label>
        <input
          type="date"
          id="expirationDate"
          v-model="inboundData.expirationDate"
          :min="minExpirationDate"
          required
        />
        <div v-if="computedErrorMessage" class="error">{{ computedErrorMessage }}</div>

        <div class="button-group">
          <button type="submit">등록</button>
          <button class="button-a" @click="$emit('close')" type="button">
            닫기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import apiService from '@/api/apiService'

const today = new Date().toISOString().split('T')[0]

const props = defineProps({
    isOpen: Boolean,
    errorMessage: String,
})
const computedErrorMessage = computed(() => props.errorMessage);
const emit = defineEmits(['close','refresh'])

const inboundData = ref({
  productName: '',
  quantity: null,
  expirationDate: '',
})
const minExpirationDate = ref(today)

const submitInbound = async () => {
  try {
      await apiService.createInbound(inboundData.value);
      emit('refresh');
    emit('close'); // 등록 후 모달 닫기
  } catch (error) {
    console.error("입고 데이터 등록 중 오류 발생:", error);
    emit('error', error.response?.data?.message || "입고 데이터를 등록하는 데 오류가 발생했습니다.");
  }
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-title {
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
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
.modal-form {
  display: flex;
  flex-direction: column;
}
label {
  margin-top: 10px;
  font-weight: bold;
}
input[type='text'],
input[type='number'],
input[type='date'] {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.close-button {
  background-color: transparent;
  color: #007bff;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  margin-top: 17px;
}
.button-group {
  display: flex;
  justify-content: flex-end; /* 오른쪽으로 정렬 */
  gap: 10px; /* 두 버튼 사이 간격 */
  margin-top: 20px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.button-a {
  padding: 10px 20px;
  font-size: 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
