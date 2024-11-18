<template>
  <div class="inventory-list">
    <h2 @click="resetToInitialState" style="cursor: pointer">재고 목록</h2>
    <div class="header">
      <!-- 검색 입력 및 검색 버튼 -->
      <div class="search-group">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="triggerSearch"
          placeholder="제품 이름을 입력하세요"
        />
        <button @click="triggerSearch">검색</button>
        <!-- 정렬 선택 셀렉트 박스 -->
        <select v-model="selectedSort" @change="triggerSort">
          <option value="" disabled hidden>정렬 기준을 선택하세요</option>
          <option value="productName">이름순</option>
          <option value="totalQuantity">수량순</option>
        </select>
        <select v-model="sortDirection" @change="triggerSort">
          <option value="" disabled hidden>정렬 방향을 선택하세요</option>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>

      <!-- 재고등록 버튼 -->
      <button @click="openInventoryManagementModal">재고 관리</button>
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
import InventoryInbound from '@/components/inventory/InventoryInbound.vue';
import InventoryOutbound from '@/components/inventory/InventoryOutbound.vue';
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


// 재고 목록
// fetchInventoryList 함수에서 productId 포함 확인
async function fetchInventoryList(isSearch = false) {
  try {
    const response = await apiService.fetchInventoryList(
      currentPage.value - 1,
      itemsPerPage.value,
      selectedSort.value || 'productName',
      sortDirection.value || 'asc',
      isSearch ? searchQuery.value : ''
    );
    // 응답 데이터에 productId가 포함되어 있는지 확인
    inventoryItems.value = response.data.data.elements.map(item => {
      if (!item.productId) {
        console.warn("productId가 없는 항목:", item);
      }
      return item;
    });
    totalPages.value = response.data.data.totalPages;
  } catch (error) {
    console.error('재고 목록을 가져오는 중 오류 발생:', error);
  }
}

// fetchAndOpenDetail 함수에서 productId가 없을 경우 오류 출력
async function fetchAndOpenDetail(item) {
  selectedProductId.value = item.productId;
  selectedProductName.value = item.productName;

  try {
    const response = await apiService.getInventoriesByProductId(item.productId);
    inventoryDetails.value = response.data.data;
    isModalOpen.value = true;
    console.log("모달 열림 상태:", isModalOpen.value); // 디버깅 로그 추가
  } catch (error) {
    console.error('상세 재고 정보를 가져오는 중 오류 발생:', error);
  }
}

function openInventoryManagementModal() {
  isInventoryManagementModalOpen.value = true;
}

function openActionModal(actionType) {
  isInventoryManagementModalOpen.value = false;
  errorMessage.value = ''; // 기존 오류 메시지 초기화
  if (actionType === '입고') {
    isInboundModalOpen.value = true;
  }
  else if (actionType === '출고') {
    isOutboundModalOpen.value = true;
  }
  else if (actionType === '소모') {
    isConsumptionModalOpen.value = true;
  }
  else if (actionType === '조정') {
    isAdjustmentModalOpen.value = true;
  }
}

// `InventoryInbound` 모달에서 에러 메시지 설정
function handleInboundError(message) {
  errorMessage.value = message;
}
function handleOutboundError(message) {
  errorMessage.value = message;
}
function handleConsumptionError(message) {
  errorMessage.value = message;
}
function handleAdjustmentError(message) {
  errorMessage.value = message;
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
  searchQuery.value = '' // 검색어 초기화
  currentPage.value = 1 // 첫 페이지로 이동
  selectedSort.value = '' // 정렬 기준 초기화
  sortDirection.value = '' // 정렬 방향을 기본 오름차순으로 초기화
  await fetchInventoryList() // 전체 제품 목록 새로 가져오기
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchInventoryList()
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
