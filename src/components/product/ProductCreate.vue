<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h3>제품 등록</h3>
      <form @submit.prevent="submitForm">
        <label for="productName">제품 이름:</label>
        <input v-model="productName" id="productName" type="text" required /><br>
        
        <label for="productType">제품 종류:</label>
        <select v-model="productType" id="productType" required>
          <option value="완제품">완제품</option>
          <option value="원재료">원재료</option>
        </select><br>
        
        <label for="safetyStockQuantity">임계 재고 수량:</label>
        <input v-model="safetyStockQuantity" id="safetyStockQuantity" type="number" required /><br>
        
        <button type="submit">등록</button>
        <button @click="closeModal">닫기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({ // eslint-disable-line no-unused-vars
  isVisible: Boolean,
})

const emits = defineEmits(['close', 'submit'])

const productName = ref('')
const productType = ref('')
const safetyStockQuantity = ref(0)

function closeModal() {
  resetForm() // 입력 필드 초기화
  emits('close')
}

function submitForm() {
  emits('submit', {
    productName: productName.value,
    productType: productType.value,
    safetyStockQuantity: safetyStockQuantity.value
  })
  resetForm() // 입력 필드 초기화
  closeModal()
}

function resetForm() {
  productName.value = ''
  productType.value = ''
  safetyStockQuantity.value = 0
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
</style>
