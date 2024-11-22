<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>생산 계획 선택</h3>
        <!-- 검색 및 필터링 -->
      <div class="search-group">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="생산 계획 검색"
          class="search-bar"
        />
        <select v-model="selectedStatus" @change="filterByStatus">
          <option value="">진행 상태</option>
          <option value="진행중">진행중</option>
          <option value="완료">완료</option>
        </select>
        
      </div>
  
        <table class="production-table">
          <thead>
            <tr>
              <th>생산할 제품</th>
              <th>목표 수량</th>
              <th>결과 수량</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="production in paginatedProductions"
              :key="production.productionId"
              @click="confirmSelection(production)"
            >
              <td>{{ production.productName }}</td>
              <td>{{ production.targetQuantity }}</td>
              <td>{{ production.resultQuantity }}</td>
              <td>{{ production.productionStatus }}</td>
            </tr>
          </tbody>
        </table>
  
        <!-- 페이지 네비게이션 -->
        <ProductPagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @go-to-page="goToPage"
        />
  
        <div class="button-group">
          <button class="jump-button" @click="$emit('close')" style="background-color: red; color: white; float: right;">닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import apiService from "@/api/apiService";
  import ProductPagination from "@/components/product/ProductPagination.vue";
  
  const emit = defineEmits(["confirm-selection", "close"]);
  
  const productions = ref([]);
  const filteredProductions = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const searchQuery = ref("");
  const selectedStatus = ref(""); // 선택된 상태 필터
  
  const fetchProductionList = async () => {
    try {
      const response = await apiService.fetchProductionList(0, 1000); // 생산 계획 데이터 가져오기
      productions.value = response.data.data.elements;
      filteredProductions.value = productions.value.slice();
      filterByStatus(); // 상태 필터링 적용
      handleSearch();
    } catch (error) {
      console.error("생산 계획 목록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };
  
  const totalPages = computed(() => {
    return Math.ceil(filteredProductions.value.length / itemsPerPage);
  });
  
  // 검색 처리
const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase();
  const statusFiltered = selectedStatus.value
    ? productions.value.filter(
        (production) => production.productionStatus === selectedStatus.value
      )
    : productions.value;

  if (!query) {
    filteredProductions.value = statusFiltered.slice();
  } else {
    filteredProductions.value = statusFiltered.filter((production) =>
      production.productName.toLowerCase().includes(query)
    );
  }
  currentPage.value = 1;
};


// 상태 필터링
const filterByStatus = () => {
  const status = selectedStatus.value;
  if (!status) {
    filteredProductions.value = productions.value.slice(); // 전체 표시
  } else {
    filteredProductions.value = productions.value.filter(
      (production) => production.productionStatus === status
    );
  }
  handleSearch(); // 검색 필터 적용
};
  
  const paginatedProductions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProductions.value.slice(start, end);
  });
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  
  const confirmSelection = (production) => {
    emit("confirm-selection", production);
  };
  
  fetchProductionList();
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #3f72af;
}

.search-bar {
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

.production-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.production-table th, .production-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.production-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.production-table tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.production-table tr.selected {
  background-color: #cce5ff; /* 선택된 행 색상 */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn {
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
}

.confirm-btn:hover {
  background-color: #2c5987;
}

.cancel-btn {
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c9302c;
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
select {
    padding: 10px 20px;
    font-size: 16px;
    border: 2px solid black;
    height: 40px;
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
</style>
  