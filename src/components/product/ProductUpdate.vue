<!-- ProductUpdate.vue -->
<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">제품 수정</h3>
      <form @submit.prevent="submitForm" class="modal-form">
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
            <option v-for="type in productTypes" :key="type" :value="type">
              {{ type }}
            </option></select
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
          <label for="productPrice">제품 가격:</label>
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
            <button class="jump-button" type="submit">확인</button>
            <button
              class="jump-button"
              @click="closeModal"
              style="background-color: red; color: white; float: right"
            >
              취소
            </button>
          </div>
        </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  product: Object,
  productTypes: {
    type: Array,
    default: () => ['완제품', '원재료'],
  },
  errorMessage: String, // 에러 메시지를 prop으로 받아옴
})

const emits = defineEmits(['close', 'submit'])

const productName = ref('')
const productType = ref('')
const safetyStockQuantity = ref(0)
const productPrice = ref(0)
const computedErrorMessage = computed(() => props.errorMessage)

// 제품 정보 초기화
watch(
  () => props.product,
  newProduct => {
    if (newProduct) {
      productName.value = newProduct.productName
      productType.value = newProduct.productType
      safetyStockQuantity.value = newProduct.safetyStockQuantity
      productPrice.value = newProduct.productPrice
    }
  },
  { immediate: true },
)

// 폼 제출 처리
async function submitForm() {
  const updatedProduct = {
    productName: productName.value,
    productType: productType.value,
    safetyStockQuantity: safetyStockQuantity.value,
    productPrice: productPrice.value,
  }

  try {
    await emits('submit', updatedProduct)
    // closeModal()을 여기서 호출하지 않음 - 성공 시에만 모달 닫히도록 함
  } catch (error) {// eslint-disable-line no-unused-vars
    
    // 여기서는 오류 발생 시 closeModal 호출하지 않음
  }
}

// 모달 닫기
function closeModal() {
  resetForm()
  emits('close')
}

// 입력 필드 초기화
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
  border-radius: 8px;
  width: 800px; /* 가로 너비 증가 */
  max-width: 95%;
  max-height: 90vh; /* 높이를 제한하여 스크롤 가능 */
  overflow-y: auto; /* 스크롤 활성화 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
.modal-title {
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
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
/* 스크롤바를 숨기기 위한 스타일 */
.modal-content::-webkit-scrollbar {
  display: none;
}
.modal-content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.modal-form {
  display: flex;
  flex-direction: column;
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
  min-height: 20px; /* 에러 메시지 공간 유지 */
  margin-bottom: 10px; /* 버튼 그룹과 간격 유지 */
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
