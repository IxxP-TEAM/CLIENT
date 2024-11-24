<template>
  <div class="sales-history">
    <h2>고객사별 총 매출</h2>

    <!-- 검색 필터 -->
    <div class="header">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="고객사명 검색"
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
            <th>고객사명</th>
            <th>총 매출</th>
          </tr>
        </thead>
        <tbody>
          <!-- 데이터 없을 때 -->
          <tr v-if="paginatedSalesData.length === 0">
            <td colspan="3">입력한 고객사가 존재하지않습니다.</td>
          </tr>
          <!-- 데이터 있을 때 -->
          <tr v-for="(sales, index) in paginatedSalesData" :key="index">
            <td>{{ (pageNumber - 1) * pageSize + index + 1 }}</td>
            <td>{{ sales.customerId }}</td>
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
import apiService from '@/api/apiService'

export default {
  data() {
    return {
      salesData: [], // 전체 데이터
      searchQuery: '', // 검색어
      pageNumber: 1, // 현재 페이지
      pageSize: 10, // 페이지당 항목 수
    }
  },
  computed: {
    filteredSalesData() {
      if (!this.searchQuery.trim()) {
        return this.salesData
      }
      return this.salesData.filter(sales =>
        sales.customerId.includes(this.searchQuery)
      )
    },
    paginatedSalesData() {
      const start = (this.pageNumber - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredSalesData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredSalesData.length / this.pageSize)
    },
  },
  methods: {
    async fetchSalesData() {
      try {
        const response = await apiService.getTotalSalesByCustomer(
          this.pageNumber - 1,
          this.pageSize
        )
        this.salesData = response.data.data.content || [] // Content만 사용
        this.totalPages = response.data.data.totalPages // 전체 페이지 수 저장
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error)
      }
    },
    setPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.pageNumber = page
      }
    },
    prevPage() {
      if (this.pageNumber > 1) {
        this.pageNumber--
      }
    },
    nextPage() {
      if (this.pageNumber < this.totalPages) {
        this.pageNumber++
      }
    },
    handleSearch() {
      this.pageNumber = 1 // 검색 시 첫 페이지로 이동
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(value)
    },
  },
  created() {
    this.fetchSalesData()
  },
}
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

.header input[type='text'] {
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
  /* margin-bottom: 20px; */
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
  color: black; /* 기본 색상 */
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.pagination-page:hover {
  color: #434190; /* 호버 시 색상 */
  transform: scale(1.1); /* 살짝 커지는 효과 */
}

.pagination-page.active {
  color: #3f72af; /* 현재 페이지 텍스트 강조 */
  font-size: 18px; /* 약간 더 큰 텍스트 */
  text-decoration: underline;
}

.pagination-arrow {
  font-size: 18px;
  font-weight: bold;
  color: #3f72af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.pagination-arrow:hover {
  color: #434190; /* 호버 시 색상 변화 */
  transform: translateY(-2px); /* 살짝 떠오르는 효과 */
}

.pagination-arrow:disabled {
  color: #b0b0b0; /* 비활성화 시 색상 */
  cursor: not-allowed;
  transform: none;
}
.search-input {
  padding: 8px;
  font-size: 16px;
  width: 300px;
  border: 1px solid #ccc; /* 테두리 색상 */
  border-radius: 5px; /* 둥글기 설정 */
  outline: none; /* 클릭 시 기본 윤곽선 제거 */
  transition: box-shadow 0.3s ease; /* 포커스 애니메이션 */
}

.search-input:focus {
  border-color: #3f72af; /* 포커스 시 테두리 색상 */
  box-shadow: 0 0 5px rgba(63, 114, 175, 0.5); /* 포커스 시 그림자 효과 */
}

</style>
