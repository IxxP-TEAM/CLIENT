<!-- ProductList.vue -->
<template>
  <div class="product-list">
    <h2 @click="resetToInitialState" style="cursor: pointer">제품 목록</h2>
    <div class="header">
      <div class="search-filter-container">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="triggerSearch"
          placeholder="제품 이름을 입력하세요"
          class="search-input"
        />
        <button @click="triggerSearch" class="jump-button">검색</button>
        <button @click="toggleFilters" class="jump-button">
          <i class="fas fa-sliders-h"></i>
        </button>
      </div>
      <button @click="openModal" class="jump-button">제품등록</button>
    </div>
    <div v-if="showFilters" class="filters">
      <div class="filter-group">
        <select
          v-model="selectedSort"
          @change="triggerSort"
          class="filter-select"
        >
          <option value="" disabled hidden>정렬 기준을 선택하세요</option>
          <option value="productName">이름순</option>
          <option value="productType">종류순</option>
        </select>
      </div>

      <div class="filter-group">
        <select
          v-model="sortDirection"
          @change="triggerSort"
          class="filter-select"
        >
          <option value="" disabled hidden>정렬 방향을 선택하세요</option>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    </div>

    <!-- 제품 목록 테이블 -->
    <ProductTable
      :products="currentItems"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      :isDeleteMode="isDeleteMode"
      @delete="openDeleteModal"
      @update="openUpdateModal"
    />

    <!-- 제품삭제 버튼 -->
    <button @click="toggleDeleteMode" style="float: inline-end" class="jump-button">
      {{ isDeleteMode ? '삭제 모드 종료' : '제품삭제' }}
    </button>

    <!-- 페이지 네비게이션 -->
    <ProductPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @go-to-page="goToPage"
    />

    <!-- 제품 등록 모달 -->
    <ProductCreate
      :isVisible="isModalVisible"
      :errorMessage="errorMessage"
      @close="closeModal"
      @submit="registerProduct"
    />

    <!-- 삭제 확인 모달 -->
    <ProductDelete
      v-if="isDeleteModalVisible"
      :productName="selectedProduct?.productName"
      :errorMessage="errorMessage"
      @confirm="confirmDeleteProduct"
      @close="closeDeleteModal"
    />

    <!-- 제품 수정 모달 -->
    <ProductUpdate
      v-if="isUpdateModalVisible"
      :isVisible="isUpdateModalVisible"
      :product="selectedProduct"
      :errorMessage="errorMessage"
      @close="closeUpdateModal"
      @submit="updateProduct"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/api/apiService'
import ProductTable from '@/components/product/ProductTable.vue'
import ProductPagination from '@/components/product/ProductPagination.vue'
import ProductCreate from '@/components/product/ProductCreate.vue'
import ProductDelete from '@/components/product/ProductDelete.vue'
import ProductUpdate from '@/components/product/ProductUpdate.vue'

// 상태 변수
const products = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = ref(1)
const isModalVisible = ref(false)
const isDeleteMode = ref(false)
const isDeleteModalVisible = ref(false)
const isUpdateModalVisible = ref(false)
const selectedProduct = ref(null)
const searchQuery = ref('')
const selectedSort = ref('')
const sortDirection = ref('')
const errorMessage = ref('')
const showFilters = ref(false)

const currentItems = computed(() => products.value)

// 페이지 이동 메서드
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (searchQuery.value) {
      triggerSearch() // 검색어가 있을 경우 검색 요청
    } else {
      fetchProducts() // 검색어가 없으면 일반 목록 요청
    }
  }
}

function triggerSort() {
  if (searchQuery.value) {
    triggerSearch() // 검색어가 있을 경우 검색 결과를 정렬
  } else {
    fetchProducts() // 검색어가 없으면 전체 데이터를 정렬
  }
}

// 모달 열기
function openModal() {
  errorMessage.value = ''
  isModalVisible.value = true
}

// 모달 닫기
function closeModal() {
  isModalVisible.value = false
}

// 수정 모달 열기
function openUpdateModal(product) {
  errorMessage.value = ''
  if (product) {
    selectedProduct.value = product
    isUpdateModalVisible.value = true
  } else {
    console.error('제품이 선택되지 않았습니다.')
  }
}

// 수정 모달 닫기
function closeUpdateModal() {
  isUpdateModalVisible.value = false
  selectedProduct.value = null
}

// 삭제 모드 토글
function toggleDeleteMode() {
  isDeleteMode.value = !isDeleteMode.value
}

// 삭제 확인 모달 열기
function openDeleteModal(product) {
  selectedProduct.value = product
  isDeleteModalVisible.value = true
}

// 삭제 확인 모달 닫기
function closeDeleteModal() {
  isDeleteModalVisible.value = false
  selectedProduct.value = null
}

// 초기 상태로 복귀
async function resetToInitialState() {
  searchQuery.value = '' // 검색어 초기화
  currentPage.value = 1 // 첫 페이지로 이동
  selectedSort.value = '' // 정렬 기준 초기화
  sortDirection.value = '' // 정렬 방향을 기본 오름차순으로 초기화
  products.value = [] // 상태 초기화
  await fetchProducts() // 전체 제품 목록 새로 가져오기
}

// 제품 삭제
async function confirmDeleteProduct() {
  try {
    await apiService.deleteProduct(selectedProduct.value.productId)
    fetchProducts()
    closeDeleteModal()
    isDeleteMode.value = false
  } catch (error) {
    console.error('제품 삭제 중 오류가 발생했습니다:', error)
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'PRODUCT-004'
    ) {
      errorMessage.value = error.response.data.message // 서버에서 받은 메시지를 설정
      isDeleteModalVisible.value = true
    } else {
      errorMessage.value = '제품 삭제할 수 없다.'
      isDeleteModalVisible.value = true // 일반 오류 시에도 모달 유지
    }
  }
}

// 검색 기능 실행
async function triggerSearch() {
  try {
    const response = await apiService.searchProducts(
      searchQuery.value,
      currentPage.value - 1, // 현재 페이지 번호 (백엔드에서는 0부터 시작)
      itemsPerPage,
      selectedSort.value || 'productName', // 정렬 기준이 설정되지 않은 경우 기본값
      sortDirection.value || 'asc', // 정렬 방향이 설정되지 않은 경우 기본값
    )

    products.value = response.data.data.elements // 검색 결과 저장
    totalPages.value = response.data.data.totalPages // 페이지 수 저장
  } catch (error) {
    console.error('제품 검색 중 오류가 발생했습니다:', error)
  }
}

function toggleFilters() {
  showFilters.value = !showFilters.value
}

// 데이터 조회
async function fetchProducts() {
  try {
    const response = await apiService.getProductList(
      currentPage.value - 1, // 백엔드는 0부터 시작하므로 1을 빼줌
      itemsPerPage,
      selectedSort.value || 'productName', 
      sortDirection.value || 'asc', 
    )

    console.log('API 응답 데이터:', response.data.data.elements) // 응답 데이터 확인
    products.value = response.data.data.elements // 현재 페이지의 제품 리스트를 저장
    totalPages.value = response.data.data.totalPages // 전체 페이지 수 저장
  } catch (error) {
    console.error('제품 목록을 불러오는 중 오류가 발생했습니다:', error)
  }
}

// 제품 등록
async function registerProduct(newProduct) {
  try {
    await apiService.createProduct(newProduct)
    fetchProducts()
    closeModal() // 성공적으로 등록된 경우에만 모달을 닫음
  } catch (error) {
    console.error('제품 등록 중 오류가 발생했습니다:', error.response)

    // 서버에서 오류 메시지를 받아서 표시
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'PRODUCT-001'
    ) {
      errorMessage.value = error.response.data.message // 서버에서 받은 메시지를 설정
      isModalVisible.value = true // 모달을 닫지 않고 유지
    } else {
      errorMessage.value = '제품 등록 중 오류가 발생했습니다.'
      isModalVisible.value = true // 일반 오류 시에도 모달 유지
    }
  }
}

// 제품 수정
async function updateProduct(updatedData) {
  if (!selectedProduct.value) {
    console.error('수정할 제품이 선택되지 않았습니다.')
    return
  }
  try {
    await apiService.updateProduct(selectedProduct.value.productId, updatedData)
    await fetchProducts()
    closeUpdateModal() // 성공적으로 업데이트된 경우에만 모달을 닫음
  } catch (error) {
    console.error('제품 수정 중 오류가 발생했습니다1:', error.response)

    // 서버에서 오류 메시지를 받아서 표시
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'PRODUCT-001'
    ) {
      errorMessage.value = error.response.data.message // 서버에서 받은 메시지를 설정
      isUpdateModalVisible.value = true // 모달을 닫지 않고 유지
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.code === 'PRODUCT-004'
    ) {
      errorMessage.value = error.response.data.message // 서버에서 받은 메시지를 설정
      isUpdateModalVisible.value = true
    } else {
      errorMessage.value = '제품 수정 중 오류가 발생했습니다.'
      isUpdateModalVisible.value = true // 일반 오류 시에도 모달 유지
    }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-list {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto; 
}
.product-list h2 {
  width: 150px;
}
.header {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 20px;
}



.header input[type='text'] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
}

.header button,
.product-list button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}
.table-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.search-filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-input {
  padding: 8px;
  font-size: 16px;
  width: 300px;
}

.filter-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.filter-icon-button .fas {
  color: #4caf50;
}

.register-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.filters {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  background-color: #f9f9f9; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  margin-bottom: 20px; 
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-size: 14px;
  font-weight: bold;
  color: #333; 
}

.filter-select {
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  color: #333;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.filter-select:focus {
  border-color: #3f72af;
  box-shadow: 0 0 4px rgba(63, 114, 175, 0.5);
  outline: none;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #f4f4f4;
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
  transform 0.2s ease,
  background-color 0.2s ease;
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}

.status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
}

.status.active {
  background-color: #4caf50; 
}

.status.inactive {
  background-color: #f44336; 
}
</style>
