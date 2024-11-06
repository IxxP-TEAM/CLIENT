<!-- ProductList.vue -->
<template>
  <div class="product-list">
    <h2 @click="resetToInitialState" style="cursor: pointer;">제품 목록</h2>
    <!-- 검색 입력 및 검색 버튼 -->
    <input
      type="text"
      v-model="searchQuery"
      @keyup.enter="triggerSearch"
      placeholder="제품 이름을 입력하세요"
    />
    <button @click="triggerSearch">검색</button>

    <!-- 제품 목록 테이블 -->
    <ProductTable
      :products="currentItems"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      :isDeleteMode="isDeleteMode"
      @delete="openDeleteModal"
      @update="openUpdateModal"
    />

    <!-- 제품등록 버튼 -->
    <button @click="openModal">제품등록</button>
    
    <!-- 제품삭제 버튼 -->
    <button @click="toggleDeleteMode" style="float: inline-end">
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
      @close="closeModal"
      @submit="registerProduct"
    />

    <!-- 삭제 확인 모달 -->
    <ProductDelete
      v-if="isDeleteModalVisible"
      :productName="selectedProduct?.productName"
      @confirm="confirmDeleteProduct"
      @close="closeDeleteModal"
    />

    <!-- 제품 수정 모달 -->
    <ProductUpdate
      v-if="isUpdateModalVisible"
      :isVisible="isUpdateModalVisible"
      :product="selectedProduct"
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
const isModalVisible = ref(false)
const isDeleteMode = ref(false)
const isDeleteModalVisible = ref(false)
const isUpdateModalVisible = ref(false)
const selectedProduct = ref(null)
const searchQuery = ref('')

// 현재 페이지에 맞는 아이템만 필터링
const currentItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return products.value.slice(start, end)
})

// 총 페이지 수 계산
const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage))

// 페이지 이동 메서드
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 모달 열기
function openModal() {
  isModalVisible.value = true
}

// 모달 닫기
function closeModal() {
  isModalVisible.value = false
}

// 수정 모달 열기
function openUpdateModal(product) {
  if (product) {
    console.log("선택된 제품:", product);
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
  currentPage.value = 1 // 페이지를 처음으로 설정
  await fetchProducts() // 전체 제품 목록을 다시 가져오기
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
  }
}

// 검색 기능 실행
async function triggerSearch() {
  try {
    const response = await apiService.searchProducts(searchQuery.value)
    products.value = response.data.data
    currentPage.value = 1 // 검색 후 첫 페이지로 이동
  } catch (error) {
    console.error('제품 검색 중 오류가 발생했습니다:', error)
  }
}

// 제품 목록 가져오기
async function fetchProducts() {
  try {
    const response = await apiService.getProductList()
    products.value = response.data.data
  } catch (error) {
    console.error('제품 목록을 불러오는 중 오류가 발생했습니다:', error)
  }
}

// 제품 등록
async function registerProduct(newProduct) {
  try {
    await apiService.createProduct(newProduct)
    fetchProducts()
    closeModal()
  } catch (error) {
    console.error('제품 등록 중 오류가 발생했습니다:', error)
  }
}

// 제품 수정
async function updateProduct(updatedData) {
  if (!selectedProduct.value) {
    console.error('수정할 제품이 선택되지 않았습니다.')
    return
  }
  console.log("업데이트할 데이터:", updatedData)
  try {
    await apiService.updateProduct(selectedProduct.value.productId, updatedData)
    await fetchProducts()
    closeUpdateModal()
  } catch (error) {
    console.error('제품 수정 중 오류가 발생했습니다:', error)
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style lang="css" scoped>
.product-list{
  padding: 100px;
    width: max-content;
    margin-left: 100px;
    height: calc(100vh - 50px); /* Adjusts height to take up viewport height minus header */
    overflow: auto;
}
</style>
