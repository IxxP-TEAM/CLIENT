<template>
    <div class="production-list">
      <h2 @click="resetToInitialState" style="cursor: pointer">생산 목록</h2>
      <div class="header">
        <div class="search-group">
          <!-- 정렬 선택 셀렉트 박스 -->
          <select v-model="selectedSort" @change="triggerSort">
            <option value="" disabled hidden>정렬 기준을 선택하세요</option>
            <option value="productionId">최신순</option>
            <option value="productionStatus">상태순</option>
          </select>
          <select v-model="sortDirection" @change="triggerSort">
            <option value="" disabled hidden>정렬 방향을 선택하세요</option>
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
  
        <!-- 생산관리 버튼 -->
        <button @click="openProductionManagementModal">생산 관리</button>
      </div>
  
      <!-- InventoryTable 컴포넌트에 데이터 전달 -->
    <ProductionTable
      :productionItems="productionItems"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      @detail="openDetailModal"
    />

    <!-- 페이지 네비게이션 -->
    <ProductionPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @go-to-page="goToPage"
    />

    <!-- 상세 보기 모달 -->
    <ProductionDetail
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :materials="selectedProductionMaterials"
      :productionName="selectedProductionName"
      :productionAnalysis="selectedProductionAnalysis"
      @close="isModalOpen = false"
    />

    <!-- 생산관리 -->
    <ProductionManagementModal 
      v-if="isProductionManagementModalOpen" 
      :is-open="isProductionManagementModalOpen"
      @close="isProductionManagementModalOpen = false"
      @open-action-modal="openActionModal"
    />

    <!-- 생산등록 -->
    <ProductionCreate
      v-if="isProductionModalOpen"
      :errorMessage="errorMessage"
      :is-open="isProductionModalOpen" 
      @close="isProductionModalOpen = false" 
      @refresh="resetToInitialState"
      @error="handleProductionError"
    />

    <!-- 생산결과 -->
    <ProductionResult
      v-if="isProductionResultModalOpen"
      :errorMessage="errorMessage"
      :is-open="isProductionResultModalOpen" 
      @close="isProductionResultModalOpen = false" 
      @refresh="resetToInitialState"
      @error="handleProductionResultError"
    />

    <!-- 생산분석 -->
    <ProductionAnalysis
      v-if="isProductionAnalysisModalOpen"
      :errorMessage="errorMessage"
      :is-open="isProductionAnalysisModalOpen" 
      @close="isProductionAnalysisModalOpen = false" 
      @refresh="resetToInitialState"
      @error="handleProductionAnalysisError"
    />
  
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/api/apiService'
import ProductionTable from '@/components/production/ProductionTable.vue';
import ProductionPagination from '@/components/production/ProductionPagination.vue';
import ProductionManagementModal from '@/components/production/ProductionManagementModal.vue';
import ProductionCreate from '@/components/production/ProductionCreate.vue';
import ProductionResult from '@/components/production/ProductionResult.vue';
import ProductionDetail from '@/components/production/ProductionDetail.vue';
import ProductionAnalysis from '@/components/production/ProductionAnalysis.vue';

const productionItems = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedSort = ref('')
const sortDirection = ref('')
const isModalOpen = ref(false)
const totalPages = ref(1)
const isProductionManagementModalOpen = ref(false)
const errorMessage = ref('')
const isProductionModalOpen = ref(false)
const isProductionResultModalOpen = ref(false)
const isProductionAnalysisModalOpen = ref(false)

async function fetchProductionList() {
  try {
    const response = await apiService.fetchProductionList(
      currentPage.value - 1,
      itemsPerPage.value,
      selectedSort.value || 'productionId',
      sortDirection.value || 'desc'
    );
    productionItems.value = response.data.data.elements;
    totalPages.value = response.data.data.totalPages;
  } catch (error) {
    console.error('재고 목록을 가져오는 중 오류 발생:', error);
  }
}

// 상세 보기 모달 열기
const selectedProductionMaterials = ref([]);
const selectedProductionName = ref('');
const selectedProductionAnalysis = ref(null);

const openDetailModal = async (production) => {
  selectedProductionName.value = production.productName;

  try {
    // 원재료 데이터 가져오기
    const materialResponse = await apiService.getProductionDetails(production.productionId);
    selectedProductionMaterials.value = materialResponse.data.data; // 원재료 데이터
  } catch (error) {
    console.error('원재료 데이터를 불러오는 중 오류 발생:', error);
    selectedProductionMaterials.value = []; // 원재료 데이터를 초기화
  }

  try {
    // 생산 분석 데이터 가져오기
    const analysisResponse = await apiService.fetchProductionAnalysis(production.productionId);
    console.log("생산 분석 데이터:", analysisResponse.data); // 디버깅용 로그
    selectedProductionAnalysis.value = analysisResponse.data.data; // 분석 데이터 설정
  } catch (error) {
    console.warn('생산 분석 데이터를 불러오는 중 오류 발생:', error);
    selectedProductionAnalysis.value = null; // 생산 분석 데이터를 초기화
  }

  // 모달 열기
  isModalOpen.value = true;
};

// 페이지 이동 메서드
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
      fetchProductionList() // 검색어가 없으면 일반 목록 요청
  }
}

// 정렬
function triggerSort() {
    fetchProductionList() // 검색어가 없으면 전체 데이터를 정렬
}

function openProductionManagementModal() {
  isProductionManagementModalOpen.value = true;
}

function openActionModal(actionType) {
  isProductionManagementModalOpen.value = false;
  errorMessage.value = ''; // 기존 오류 메시지 초기화
  if (actionType === '생산') {
    isProductionModalOpen.value = true;
  }
  else if (actionType === '완료') {
    isProductionResultModalOpen.value = true;
  }
  else if (actionType === '분석') {
    isProductionAnalysisModalOpen.value = true;
  }
  
}

function handleProductionError(message) {
  errorMessage.value = message;
}
function handleProductionResultError(message) {
  errorMessage.value = message;
}
function handleProductionAnalysisError(message) {
  errorMessage.value = message;
}

// 초기 상태로 복귀
async function resetToInitialState() {
  currentPage.value = 1 // 첫 페이지로 이동
  selectedSort.value = '' // 정렬 기준 초기화
  sortDirection.value = '' // 정렬 방향을 기본 오름차순으로 초기화
  await fetchProductionList() // 전체 제품 목록 새로 가져오기
}

onMounted(() => {
  fetchProductionList()
})

  </script>
  
  <style scoped>
  .production-list-container {
    padding: 20px;
  }
  .production-list {
    padding-top: 70px;
    width: 1180px;
    margin-left: 140px;
    height: calc(100vh - 50px);
    overflow-y: auto; /* 세로 스크롤 활성화 */
  }
  .production-list h2 {
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
  .production-list button {
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
  