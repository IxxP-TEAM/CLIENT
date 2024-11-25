<template>
  <div class="inventory-list">
    <h2 @click="resetToInitialState" style="cursor: pointer">재고 목록</h2>
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

      <button @click="openInventoryManagementModal" class="jump-button">
        재고 관리
      </button>
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
          <option value="totalQuantity">수량순</option>
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

    <!-- InventoryTable 컴포넌트에 데이터 전달 -->
    <InventoryTable
      :inventoryItems="inventoryItems"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      @detail="fetchAndOpenDetail"
    />

    <!-- 페이지 네비게이션 -->
    <InventoryPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @go-to-page="goToPage"
    />

    <!-- InventoryDetailModal 컴포넌트 -->
    <InventoryDetail
      v-if="isModalOpen"
      :inventoryDetails="inventoryDetails"
      :productName="selectedProductName"
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
    />
    <!-- 재고관리 -->
    <InventoryManagementModal
      v-if="isInventoryManagementModalOpen"
      :is-open="isInventoryManagementModalOpen"
      @close="isInventoryManagementModalOpen = false"
      @open-action-modal="openActionModal"
    />

    <!-- 입고 -->
    <InventoryInbound
      v-if="isInboundModalOpen"
      :errorMessage="errorMessage"
      :is-open="isInboundModalOpen"
      @close="isInboundModalOpen = false"
      @refresh="resetToInitialState"
      @error="handleInboundError"
    />

    <!-- 출고 -->
    <InventoryOutbound
      v-if="isOutboundModalOpen"
      :errorMessage="errorMessage"
      :is-open="isOutboundModalOpen"
      @close="isOutboundModalOpen = false"
      @refresh="resetToInitialState"
      @error="handleOutboundError"
    />

    <!-- 소모 -->
    <InventoryConsumption
      v-if="isConsumptionModalOpen"
      :errorMessage="errorMessage"
      :is-open="isConsumptionModalOpen"
      @close="isConsumptionModalOpen = false"
      @refresh="resetToInitialState"
      @error="handleConsumptionError"
    />

    <!-- 조정 -->
    <InventoryAdjustment
      v-if="isAdjustmentModalOpen"
      :errorMessage="errorMessage"
      :is-open="isAdjustmentModalOpen"
      @close="isAdjustmentModalOpen = false"
      @refresh="resetToInitialState"
      @error="handleAdjustmentError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/api/apiService'
import InventoryTable from '@/components/inventory/InventoryTable.vue'
import InventoryPagination from '@/components/inventory/InventoryPagination.vue'
import InventoryDetail from '@/components/inventory/InventoryDetail.vue'
import InventoryManagementModal from '@/components/inventory/InventoryManagementModal.vue'
import InventoryInbound from '@/components/inventory/InventoryInbound.vue'
import InventoryOutbound from '@/components/inventory/InventoryOutbound.vue'
import InventoryConsumption from '@/components/inventory/InventoryConsumption.vue'
import InventoryAdjustment from '@/components/inventory/InventoryAdjustment.vue'

// 상태 변수
const inventoryItems = ref([]) // InventoryListDto의 목록 데이터
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const totalPages = ref(1)
const selectedSort = ref('')
const sortDirection = ref('')
const isModalOpen = ref(false)
const selectedProductId = ref(null)
const selectedProductName = ref('')
const inventoryDetails = ref([])
const isInventoryManagementModalOpen = ref(false)
const isInboundModalOpen = ref(false)
const isOutboundModalOpen = ref(false)
const isConsumptionModalOpen = ref(false)
const isAdjustmentModalOpen = ref(false)
const errorMessage = ref('')
const showFilters = ref(false)

function toggleFilters() {
  showFilters.value = !showFilters.value
}

// 재고 목록
// fetchInventoryList 함수에서 productId 포함 확인
async function fetchInventoryList(isSearch = false) {
  try {
    const response = await apiService.fetchInventoryList(
      currentPage.value - 1,
      itemsPerPage.value,
      selectedSort.value || 'productName',
      sortDirection.value || 'asc',
      isSearch ? searchQuery.value : '',
    )
    // 응답 데이터에 productId가 포함되어 있는지 확인
    inventoryItems.value = response.data.data.elements.map(item => {
      if (!item.productId) {
        console.warn('productId가 없는 항목:', item)
      }
      return item
    })
    totalPages.value = response.data.data.totalPages
  } catch (error) {
    console.error('재고 목록을 가져오는 중 오류 발생:', error)
  }
}

// fetchAndOpenDetail 함수에서 productId가 없을 경우 오류 출력
async function fetchAndOpenDetail(item) {
  selectedProductId.value = item.productId
  selectedProductName.value = item.productName

  try {
    const response = await apiService.getInventoriesByProductId(item.productId)
    inventoryDetails.value = response.data.data
    isModalOpen.value = true
  } catch (error) {
    console.error('상세 재고 정보를 가져오는 중 오류 발생:', error)
  }
}

function openInventoryManagementModal() {
  isInventoryManagementModalOpen.value = true
}

function openActionModal(actionType) {
  isInventoryManagementModalOpen.value = false
  errorMessage.value = '' // 기존 오류 메시지 초기화
  if (actionType === '입고') {
    isInboundModalOpen.value = true
  } else if (actionType === '출고') {
    isOutboundModalOpen.value = true
  } else if (actionType === '소모') {
    isConsumptionModalOpen.value = true
  } else if (actionType === '조정') {
    isAdjustmentModalOpen.value = true
  }
}

// `InventoryInbound` 모달에서 에러 메시지 설정
function handleInboundError(message) {
  errorMessage.value = message
}
function handleOutboundError(message) {
  errorMessage.value = message
}
function handleConsumptionError(message) {
  errorMessage.value = message
}
function handleAdjustmentError(message) {
  errorMessage.value = message
}

// 검색 기능 실행
function triggerSearch() {
  currentPage.value = 1 // 검색할 때 페이지를 첫 페이지로 설정
  fetchInventoryList(true)
}

// 페이지 이동 메서드
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (searchQuery.value) {
      fetchInventoryList(true) // 검색어가 있을 경우 검색 요청
    } else {
      fetchInventoryList() // 검색어가 없으면 일반 목록 요청
    }
  }
}

// 정렬
function triggerSort() {
  if (searchQuery.value) {
    triggerSearch() // 검색어가 있을 경우 검색 결과를 정렬
  } else {
    fetchInventoryList() // 검색어가 없으면 전체 데이터를 정렬
  }
}

// 초기 상태로 복귀
async function resetToInitialState() {
  searchQuery.value = '' 
  currentPage.value = 1 
  selectedSort.value = '' 
  sortDirection.value = '' 
  await fetchInventoryList() 
}

onMounted(() => {
  fetchInventoryList()
})
</script>

<style scoped>
.inventory-list {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto; 
}
.inventory-list h2 {
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
.inventory-list button {
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
