<template>
    <div class="sales-history">
      <h2>판매 이력</h2>
  
      <!-- 검색 및 필터 아이콘 -->
      <div class="header">
        <div class="search-filter-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="고객사 이름 또는 직원 이름 검색"
            @input="handleSearch"
            class="search-input"
          />
        </div>
      </div>
  
      <!-- 테이블 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>고객사</th>
              <th>직원</th>
              <th>판매 날짜</th>
              <th>판매 금액</th>
            </tr>
          </thead>
          <tbody>
            <!-- 데이터 없을 때 -->
            <tr v-if="paginatedSalesHistories.length === 0">
              <td colspan="5">판매 이력이 없습니다.</td>
            </tr>
            <!-- 데이터 있을 때 -->
            <tr
              v-for="(history, index) in paginatedSalesHistories"
              :key="history.salesDate + index"
            >
              <td>{{ (pageNumber - 1) * pageSize + index + 1 }}</td>
              <td>{{ history.customerId || 'N/A' }}</td>
              <td>{{ history.userId || 'N/A' }}</td>
              <td>{{ history.salesDate || 'N/A' }}</td>
              <td>{{ history.salesAmount || 0 }}</td>
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
import apiservice from '@/api/apiService'

export default {
  data() {
    return {
      salesHistories: {
        content: [], // 원본 데이터
        totalPages: 0,
      },
      searchQuery: '', // 검색어
      filteredSalesHistories: [], // 필터링된 데이터
      paginatedSalesHistories: [], // 페이지네이션된 데이터
      pageNumber: 1, // 현재 페이지
      pageSize: 10, // 페이지당 항목 수
    }
  },
  created() {
    this.fetchSalesHistory(this.pageNumber)
  },
  watch: {
    // 검색어가 변경될 때 필터 적용
    searchQuery() {
      this.applyFilter()
    },
    // 페이지 번호가 변경될 때 페이지네이션 적용
    pageNumber() {
      this.applyPagination()
    },
  },
  methods: {
    async fetchSalesHistory(page) {
      try {
        const response = await apiservice.allSalesHistoty(
          page - 1,
          this.pageSize
        )
        this.salesHistories = response.data.data // 데이터 로드
        this.filteredSalesHistories = this.salesHistories.content // 초기 필터링
        this.applyPagination()
      } catch (error) {
        console.error('판매 이력을 가져오는 중 오류 발생:', error)
      }
    },
    applyFilter() {
      const query = this.searchQuery.toLowerCase()
      this.filteredSalesHistories = this.salesHistories.content.filter(
        history => {
          const customerName = history.customerId?.toLowerCase() || ''
          const userName = history.userId?.toLowerCase() || ''
          return customerName.includes(query) || userName.includes(query)
        }
      )
      this.applyPagination()
    },
    applyPagination() {
      const start = (this.pageNumber - 1) * this.pageSize
      const end = start + this.pageSize
      this.paginatedSalesHistories = this.filteredSalesHistories.slice(
        start,
        end
      )
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
    setPage(page) {
      this.pageNumber = page
    },
    handleSearch() {
      this.pageNumber = 1 // 검색 시 첫 페이지로 이동
      this.applyFilter()
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredSalesHistories.length / this.pageSize)
    },
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

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #f4f4f4;
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
</style>