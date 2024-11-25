<template>
  <div class="inventory-list">
    <h2 @click="resetToInitialState" style="cursor: pointer">재고 이력 목록</h2>
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
    </div>
    <!-- 필터 섹션 -->
    <div v-if="showFilters" class="filters">
      <!-- 정렬 필터 -->
      <div class="filter-group">
        <select
          v-model="selectedSort"
          @change="triggerSort"
          class="filter-select"
        >
          <option value="" disabled hidden>정렬 기준을 선택하세요</option>
          <option value="productName">이름순</option>
          <option value="changeDate">변경일순</option>
          <option value="changeType">유형순</option>
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

    <InventoryHistoryTable
      :inventoryHistoryItems="inventoryHistoryItems"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
    />

    <!-- 페이지 네비게이션 -->
    <InventoryPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @go-to-page="goToPage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/api/apiService'
import InventoryHistoryTable from '@/components/inventory/InventoryHistoryTable.vue'
import InventoryPagination from '@/components/inventory/InventoryPagination.vue'

const inventoryHistoryItems = ref([]) // InventoryListDto의 목록 데이터
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')
const totalPages = ref(1)
const selectedSort = ref('')
const sortDirection = ref('')
const showFilters = ref(false)

function toggleFilters() {
  showFilters.value = !showFilters.value
}

async function fetchInventoryHistoryList(isSearch = false) {
  try {
    const response = await apiService.fetchInventoryHistoryList(
      currentPage.value - 1,
      itemsPerPage.value,
      selectedSort.value || 'changeDate',
      sortDirection.value || 'desc',
      isSearch ? searchQuery.value : '',
    )
    inventoryHistoryItems.value = response.data.data.elements
    totalPages.value = response.data.data.totalPages
  } catch (error) {
    console.error('재고 이력 목록을 가져오는 중 오류 발생:', error)
  }
}

// 초기 상태로 복귀
async function resetToInitialState() {
  searchQuery.value = ''
  currentPage.value = 1
  selectedSort.value = ''
  sortDirection.value = ''
  await fetchInventoryHistoryList()
}

// 검색 기능 실행
function triggerSearch() {
  currentPage.value = 1
  fetchInventoryHistoryList(true)
}

// 정렬
function triggerSort() {
  if (searchQuery.value) {
    triggerSearch() // 검색어가 있을 경우 검색 결과를 정렬
  } else {
    fetchInventoryHistoryList() // 검색어가 없으면 전체 데이터를 정렬
  }
}

// 페이지 이동 메서드
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (searchQuery.value) {
      fetchInventoryHistoryList(true) // 검색어가 있을 경우 검색 요청
    } else {
      fetchInventoryHistoryList() // 검색어가 없으면 일반 목록 요청
    }
  }
}

onMounted(() => {
  fetchInventoryHistoryList()
})
</script>

<style scoped>
.inventory-list-container {
  padding: 20px;
}
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
