<!-- ProductUpdate.vue -->
<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>제품 수정</h3>
        <form @submit.prevent="submitForm">
          <label for="productName">제품 이름:</label>
          <input v-model="productName" id="productName" type="text" required /><br>
          
          <label for="productType">제품 종류:</label>
          <select v-model="productType" id="productType" required>
            <option v-for="type in productTypes" :key="type" :value="type">{{ type }}</option>
          </select><br>
          
          <label for="safetyStockQuantity">임계 재고 수량:</label>
          <input v-model="safetyStockQuantity" id="safetyStockQuantity" type="number" required /><br>
          
          <button type="submit">확인</button>
          <button @click="closeModal">취소</button>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue'
  
  const props = defineProps({
    isVisible: Boolean,
    product: Object,
    productTypes: {
      type: Array,
      default: () => ['완제품', '원재료']
    }
  })
  
  const emits = defineEmits(['close', 'submit'])
  
  const productName = ref('')
  const productType = ref('')
  const safetyStockQuantity = ref(0)
  const errorMessage = ref('')
  
  // 제품 정보 초기화
  watch(
    () => props.product,
    (newProduct) => {
      if (newProduct) {
        productName.value = newProduct.productName
        productType.value = newProduct.productType
        safetyStockQuantity.value = newProduct.safetyStockQuantity
      }
    },
    { immediate: true }
  )
  
  // 폼 제출 처리
  async function submitForm() {
    const updatedProduct = {
      productName: productName.value,
      productType: productType.value,
      safetyStockQuantity: safetyStockQuantity.value,
    }
  
    try {
      // submit 이벤트 발생
      emits('submit', updatedProduct)
      closeModal()
    } catch (error) {// eslint-disable-line no-unused-vars
      errorMessage.value = '제품 수정 중 오류가 발생했습니다.'
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
    errorMessage.value = ''
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
    z-index: 1000; /* 다른 콘텐츠 위에 표시되도록 설정 */
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>
  