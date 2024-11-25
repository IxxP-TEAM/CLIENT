<!-- InventoryInbound.vue-->
<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">입고 등록</h3>
      <form @submit.prevent="submitInbound" class="modal-form">
        <fieldset class="section">
          <legend><i class="fas fa-building"></i> 기본 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
        <label for="productName">제품 이름</label>
        </div>
        <input
          type="text"
          id="productName"
          v-model="inboundData.productName"
          @click="openProductSelector"
          readonly
          required
        /></div>
        <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
        <label for="quantity">수량</label>
        </div>
        <input
          type="number"
          id="quantity"
          v-model="inboundData.quantity"
          required
          min="1"
        /></div>
        <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
        <label for="expirationDate">유통기한</label>
        </div>
        <input
          type="date"
          id="expirationDate"
          v-model="inboundData.expirationDate"
          :min="minExpirationDate"
          required
        />
        </div>
        <div></div>
        <div class="error-container">
        <div v-if="computedErrorMessage" class="error">{{ computedErrorMessage }}</div>
      </div>
        <div class="button-group">
          <button class="jump-button" type="submit">등록</button>
          <button class="jump-button" @click="$emit('close')" type="button" style="background-color: gray; color: white; float: right;">
            닫기
          </button>
        </div>
        </div>
      </fieldset>
      </form>

      <!-- 제품 선택 모달 -->
      <InventoryProductSelector
        v-if="showProductSelector"
        :productOptions="productOptions"
        @confirm-selection="selectProduct"
        @close="closeProductSelector"
      />
      
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import apiService from '@/api/apiService'
import InventoryProductSelector from '@/components/inventory/InventoryProductSelector.vue';

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

// 제품 선택 모달 상태
const showProductSelector = ref(false) // 모달 열림 여부
const productOptions = ref([]) // 제품 목록

const products = ref([]); // 제품 목록 데이터
const totalPages = ref(0); 
const currentPage = ref(1); 
const itemsPerPage = 10; 
const selectedSort = ref('productId'); 
const sortDirection = ref('asc'); 



// 제품 선택 모달 닫기
const closeProductSelector = () => {
  showProductSelector.value = false
}
// 선택한 제품 처리
const selectProduct = product => {
  inboundData.value.productName = product.productName // 선택된 제품 이름 반영
  closeProductSelector() 
}

// 데이터 조회
async function fetchProducts() {
  try {
    const response = await apiService.getProductList(
      currentPage.value - 1,        // 백엔드는 0부터 시작하므로 1을 뺌
      itemsPerPage,
      selectedSort.value || 'productId',  
      sortDirection.value || 'asc'      
    );

    const fetchedProducts = response.data.data.elements; // 제품 리스트 가져오기
    products.value = fetchedProducts; // 전체 제품 리스트 저장
    productOptions.value = fetchedProducts; // 모달에서 사용할 옵션 데이터 설정
    totalPages.value = response.data.data.totalPages; // 전체 페이지 수 저장
  } catch (error) {
    console.error('제품 목록을 불러오는 중 오류가 발생했습니다:', error);
  }
}

// 제품 선택 모달 열기
const openProductSelector = async () => {
  await fetchProducts(); // 제품 목록 불러오기
  showProductSelector.value = true; // 모달 열기
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
  width: 800px; 
  max-width: 95%;
  max-height: 90vh; 
  overflow-y: auto; 
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
  justify-content: flex-end; 
  gap: 10px; 
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

.jump-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #3f72af;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition:
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
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
.error-container {
  min-height: 20px; 
  margin-bottom: 10px; 
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  
}
</style>
