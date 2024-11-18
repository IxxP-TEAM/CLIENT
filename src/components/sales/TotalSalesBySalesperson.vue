<template>
    <div class="sales-history">
      <h2>사원별 총 매출</h2>
  
      <!-- 검색 필터 -->
      <div class="header">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="사원명 검색"
          @input="handleSearch"
          class="search-input"
        />
      </div>
  
      <!-- 테이블 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>사원명</th>
              <th>총 매출</th>
            </tr>
          </thead>
          <tbody>
            <!-- 데이터 없을 때 -->
            <tr v-if="paginatedSalesData.length === 0">
              <td colspan="3">입력한 사원이 존재하지않습니다.</td>
            </tr>
            <!-- 데이터 있을 때 -->
            <tr v-for="(sales, index) in paginatedSalesData" :key="index">
              <td>{{ (pageNumber - 1) * pageSize + index + 1 }}</td>
              <td>{{ sales.userName }}</td>
              <td>{{ formatCurrency(sales.totalSales) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button
          @click="prevPage"
          :disabled="pageNumber === 1"
          class="pagination-arrow"
        >
          &lt;
        </button>
        <span
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          :class="{ active: pageNumber === page }"
          class="pagination-page"
        >
          {{ page }}
        </span>
        <button
          @click="nextPage"
          :disabled="pageNumber === totalPages"
          class="pagination-arrow"
        >
          &gt;
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import apiService from "@/api/apiService";
  
  export default {
    data() {
      return {
        salesData: [], // 전체 데이터
        searchQuery: "", // 검색어
        pageNumber: 1, // 현재 페이지
        pageSize: 10, // 페이지당 항목 수
      };
    },
    computed: {
      filteredSalesData() {
        if (!this.searchQuery.trim()) {
          return this.salesData;
        }
        return this.salesData.filter((sales) =>
          sales.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      paginatedSalesData() {
        const start = (this.pageNumber - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredSalesData.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.filteredSalesData.length / this.pageSize);
      },
    },
    methods: {
      async fetchSalesData(page = 0) {
        try {
          const response = await apiService.getTotalSalesBySalesperson(page, this.pageSize);
          const data = response.data.data;
          this.salesData = data.content || [];
          this.totalPages = data.totalPages;
          this.pageNumber = data.number + 1; // Spring의 페이지는 0부터 시작하므로 +1
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      },
      setPage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.pageNumber = page;
          this.fetchSalesData(page - 1);
        }
      },
      prevPage() {
        if (this.pageNumber > 1) {
          this.pageNumber--;
          this.fetchSalesData(this.pageNumber - 1);
        }
      },
      nextPage() {
        if (this.pageNumber < this.totalPages) {
          this.pageNumber++;
          this.fetchSalesData(this.pageNumber - 1);
        }
      },
      handleSearch() {
        this.pageNumber = 1; // 검색 시 첫 페이지로 이동
      },
      formatCurrency(value) {
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(value);
      },
    },
    created() {
      this.fetchSalesData();
    },
  };
  </script>
  
  <style scoped>
  .sales-history {
    padding-top: 70px;
    width: 1180px;
    margin-left: 140px;
    height: calc(100vh - 50px);
    overflow-y: auto;
  }
  
  .sales-history::-webkit-scrollbar {
    display: none;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .header input[type="text"] {
    padding: 8px;
    font-size: 16px;
    width: 300px;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .table-container::-webkit-scrollbar {
    display: none;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
  }
  
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
  }
  
  .pagination-page {
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #000000;
    transition: color 0.3s ease;
  }
  
  .pagination-page:hover {
    color: #1d4f7a;
  }
  
  .pagination-page.active {
    color: #3f72af;
    font-weight: bold;
    text-decoration: underline;
  }
  
  .pagination-arrow {
    padding: 10px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #3f72af;
    border: 1px solid #3f72af;
    background-color: white;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .pagination-arrow:hover {
    background-color: #3f72af;
    color: white;
  }
  
  .pagination-arrow:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  </style>
  