<template>
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">소모 등록</h3>
        <form @submit.prevent="submitConsumption" class="modal-form">
          <label for="productName">제품 이름</label>
          <input
            type="text"
            id="productName"
            v-model="consumptionData.productName"
            @click="openProductSelector"
            readonly
            required
          />
  
          <label for="quantity">수량</label>
          <input
            type="number"
            id="quantity"
            v-model="consumptionData.quantity"
            required
            min="1"
          />
          <div v-if="computedErrorMessage" class="error">{{ computedErrorMessage }}</div>
  
          <div class="button-group">
            <button class="jump-button" type="submit">등록</button>
            <button class="jump-button" @click="$emit('close')" type="button" style="background-color: red; color: white; float: right;">
              닫기
            </button>
          </div>
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


  
  const props = defineProps({
      isOpen: Boolean,
      errorMessage: String,
  })
  const computedErrorMessage = computed(() => props.errorMessage);
  const emit = defineEmits(['close','refresh'])
  
  const consumptionData = ref({
    productName: '',
    quantity: null,
  })

  
  const submitConsumption = async () => {
    try {
        await apiService.createConsumption(consumptionData.value);
        emit('refresh');
      emit('close'); // 등록 후 모달 닫기
    } catch (error) {
      console.error("출고 데이터 등록 중 오류 발생:", error);
      emit('error', error.response?.data?.message || "출고 데이터를 등록하는 데 오류가 발생했습니다.");
    }
  };

  // 제품 선택 모달 상태
const showProductSelector = ref(false) // 모달 열림 여부
const productOptions = ref([]) // 제품 목록

const products = ref([]); // 제품 목록 데이터
const totalPages = ref(0); // 총 페이지 수
const currentPage = ref(1); // 현재 페이지
const itemsPerPage = 10; // 페이지당 항목 수
const selectedSort = ref('productId'); // 정렬 기준 (기본값: productId)
const sortDirection = ref('asc'); // 정렬 방향 (기본값: 오름차순)



// 제품 선택 모달 닫기
const closeProductSelector = () => {
  showProductSelector.value = false
}
// 선택한 제품 처리
const selectProduct = product => {
  consumptionData.value.productName = product.productName // 선택된 제품 이름 반영
  closeProductSelector() // 모달 닫기
}

// 데이터 조회
async function fetchProducts() {
  try {
    const response = await apiService.getProductList(
      currentPage.value - 1,        // 백엔드는 0부터 시작하므로 1을 뺌
      itemsPerPage,
      selectedSort.value || 'productId',  // 정렬 기준
      sortDirection.value || 'asc'       // 정렬 방향
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
  </style>
  