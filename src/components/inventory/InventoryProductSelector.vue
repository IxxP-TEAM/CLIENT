<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>제품 선택</h3>
        <!-- 검색 입력 -->
        <input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="제품 검색"
          class="search-bar"
        />
  
        <!-- 제품 목록 -->
        <table class="product-table">
          <thead>
            <tr>
              <th>제품명</th>
              <th>제품종류</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in paginatedProducts"
              :key="product.productId"
              @click="confirmSelection(product)"
            >
              <td>{{ product.productName }}</td>
              <td>{{ product.productType }}</td>
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
          <button class="jump-button" @click="$emit('close')" style="background-color: gray; color: white; float: right;">닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import ProductPagination from "@/components/product/ProductPagination.vue";
  import apiService from "@/api/apiService";
  
  const emit = defineEmits(["confirm-selection", "close"]);
  
  const products = ref([]); // 전체 제품 데이터
  const filteredProducts = ref([]); // 필터링된 제품 데이터
  const currentPage = ref(1);
  const itemsPerPage = 10;
  const searchQuery = ref("");
  
  // 총 페이지 수 계산
  const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage);
  });
  
  // 검색 핸들링
  const handleSearch = () => {
    const query = searchQuery.value.trim().toLowerCase();
  
    if (query === "") {
      // 검색어가 비어 있을 경우 전체 데이터 사용
      filteredProducts.value = products.value.slice();
    } else {
      // 검색어가 있을 경우 필터링
      filteredProducts.value = products.value.filter((product) =>
        product.productName.toLowerCase().includes(query)
      );
    }
  
    // 페이지를 첫 번째로 초기화
    currentPage.value = 1;
  };
  
  // 페이지 데이터 계산
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.value.slice(start, end);
  });
  
  // 전체 데이터 조회
  const fetchProducts = async () => {
    try {
      const response = await apiService.getProductList(0, 1000); // 충분히 큰 데이터 가져오기
      products.value = response.data.data.elements; // 전체 데이터 저장
      filteredProducts.value = products.value.slice(); // 초기에는 전체 데이터 사용
      handleSearch(); // 검색 초기화
    } catch (error) {
      console.error("제품 목록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };
  
  // 페이지 이동
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  
  // 제품 선택 이벤트
  const confirmSelection = (product) => {
    emit("confirm-selection", product);
  };
  
  // 컴포넌트가 마운트될 때 전체 데이터 가져오기
  fetchProducts();
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

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.product-table th, .product-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.product-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.product-table tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.product-table tr.selected {
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
  