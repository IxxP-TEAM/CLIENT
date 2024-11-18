<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>유통기한별 재고</h3>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="제품명 검색"
          class="search-bar"
        />
        <table class="expiration-table">
          <thead>
            <tr>
              <th>제품명</th>
              <th>유통기한</th>
              <th>수량</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedItems"
              :key="item.inventoryId"
              @click="confirmSelection(item)"
            >
              <td>{{ item.productName }}</td>
              <td>{{ item.expirationDate }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>
        <ProductPagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @go-to-page="goToPage"
        />
        <div class="button-group">
          <button @click="$emit('close')">닫기</button>
        </div>
      </div>
    </div>
  </template>
  

  <script setup>
import { ref, computed, onMounted } from "vue";
import ProductPagination from "@/components/product/ProductPagination.vue";
import apiService from "@/api/apiService";

const emit = defineEmits(["close", "confirm-selection"]);

const inventoryItems = ref([]); // 유통기한별 데이터
const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref("");

// 검색된 데이터 필터링
const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return inventoryItems.value;
  }
  return inventoryItems.value.filter((item) =>
    item.productName.toLowerCase().includes(query)
  );
});

// 페이지네이션 데이터 계산
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

// 유통기한별 데이터 조회
const fetchExpirationData = async () => {
  try {
    const response = await apiService.getInventoryByExpiration();
    inventoryItems.value = response.data; // API에서 받은 데이터를 저장
  } catch (error) {
    console.error("유통기한별 데이터를 불러오는 중 오류가 발생했습니다:", error);
  }
};

// 페이지 이동
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 제품 선택 이벤트
const confirmSelection = (item) => {
  emit("confirm-selection", item); // 선택된 데이터를 부모 컴포넌트로 전달
};

// 데이터 로드
onMounted(fetchExpirationData);
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

.search-bar {
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

.expiration-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.expiration-table th,
.expiration-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.expiration-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.expiration-table tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
</style>
