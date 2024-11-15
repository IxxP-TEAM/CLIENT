<template>
  <div class="inventory-list">
    <h2 @click="resetToInitialState" style="cursor: pointer">재고 이력 목록</h2>
    <div class="header">
      <div class="search-group">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="triggerSearch"
          placeholder="제품 이름을 입력하세요"
        />
        <button @click="triggerSearch">검색</button>
      </div>
      <div class="sort-group">
        <select v-model="selectedSort" @change="triggerSort">
          <option value="" disabled hidden>정렬 기준을 선택하세요</option>
          <option value="productName">이름순</option>
          <option value="changeDate">변경일순</option>
          <option value="changeType">유형순</option>
        </select>
        <select v-model="sortDirection" @change="triggerSort">
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
const selectedSort = ref('changeDate')
const sortDirection = ref('asc')

async function fetchInventoryHistoryList(isSearch = false) {
  try {
    const response = await apiService.fetchInventoryHistoryList(
      currentPage.value - 1,
      itemsPerPage.value,
      selectedSort.value || 'changeDate',
      sortDirection.value || 'asc',
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
  searchQuery.value = '' // 검색어 초기화
  currentPage.value = 1 // 첫 페이지로 이동
  selectedSort.value = '' // 정렬 기준 초기화
  sortDirection.value = '' // 정렬 방향을 기본 오름차순으로 초기화
  await fetchInventoryHistoryList() // 전체 제품 목록 새로 가져오기
}

// 검색 기능 실행
function triggerSearch() {
  currentPage.value = 1 // 검색할 때 페이지를 첫 페이지로 설정
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

// 컴포넌트가 마운트될 때 데이터 가져오기
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
  overflow-y: auto; /* 세로 스크롤 활성화 */
}
.inventory-list h2 {
  width: 150px;
}
.header {
  display: flex;
  justify-content: space-between; /* 양 끝으로 배치 */
  align-items: center;
  margin-bottom: 20px;
}

/* 검색 입력과 검색 버튼을 나란히 배치 */
.search-group {
  display: flex;
  gap: 8px; /* 입력창과 버튼 간격 */
}

.search-group input[type='text'] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
}

.header button,
.search-group button,
.inventory-list button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
select {
  padding: 10px 20px;
  font-size: 16px;
  border: 2px solid black;

  border-radius: 5px;
  cursor: pointer;
}
.table-container {
  overflow-x: auto;
}
</style>
