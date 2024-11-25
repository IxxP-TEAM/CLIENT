<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">제품 등록</h3>
      <form @submit.prevent="submitForm" class="form">
        <fieldset class="section">
          <legend><i class="fas fa-building"></i> 기본 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <label for="productName">제품 이름:</label>
              </div>
              <input
                v-model="productName"
                id="productName"
                type="text"
                required
              /><br />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <label for="productType">제품 종류:</label>
              </div>
              <select v-model="productType" id="productType" required>
                <option value="" disabled hidden>제품 종류를 선택하세요</option>
                <option value="완제품">완제품</option>
                <option value="원재료">원재료</option></select
              ><br />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <label for="safetyStockQuantity">임계 재고 수량:</label>
              </div>
              <input
                v-model="safetyStockQuantity"
                min="0"
                id="safetyStockQuantity"
                type="number"
                required
              /><br />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <label for="productName">제품 가격:</label>
              </div>
              <input
                v-model="productPrice"
                min="0"
                id="productPrice"
                type="number"
                required
              /><br />
            </div>
            <div class="error-container">
              <div v-if="computedErrorMessage" class="error">
                {{ computedErrorMessage }}
              </div>
            </div>
            <div class="button-group">
              <button type="submit" class="jump-button">등록</button>
              <button
                class="jump-button"
                @click="closeModal"
                style="background-color: gray; color: white"
              >
                닫기
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  errorMessage: String,
})

const emits = defineEmits(['close', 'submit'])

const productName = ref('')
const productType = ref('')
const safetyStockQuantity = ref(0)
const productPrice = ref(0)
const computedErrorMessage = computed(() => props.errorMessage)

function closeModal() {
  resetForm() // 입력 필드 초기화
  emits('close')
}

function submitForm() {
  emits('submit', {
    productName: productName.value,
    productType: productType.value,
    safetyStockQuantity: safetyStockQuantity.value,
    productPrice: productPrice.value,
  })
  resetForm()
}

function resetForm() {
  productName.value = ''
  productType.value = ''
  safetyStockQuantity.value = 0
  productPrice.value = 0
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 800px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
.modal-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #3f72af;
}

.section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f7faff;
}

.section legend {
  font-size: 18px;
  font-weight: bold;
  color: #0066cc;
}

.form-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 16px;
  color: #666;
}

.modal-content::-webkit-scrollbar {
  display: none;
}
.modal-content {
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}
.modal-form {
  display: flex;
  flex-direction: column;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px; 
  margin-top: 20px;
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
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
label {
  margin-top: 10px;
  font-weight: bold;
}

input,
select {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.error-container {
  min-height: 20px; 
  margin-bottom: 10px; 
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.jump-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #3f72af;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition:;
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}
</style>
