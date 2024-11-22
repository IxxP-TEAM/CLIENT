<template>
  <div class="sales-history">
    <h2>판매 이력</h2>

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
          <!-- 데이터가 없을 때 -->
          <tr v-if="salesHistories && salesHistories.length === 0">
            <td colspan="5">판매 이력이 없습니다.</td>
          </tr>

          <!-- 데이터가 있을 때 -->
          <tr v-for="(history, index) in salesHistories" :key="index">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ history.customerId || 'N/A' }}</td>
            <td>{{ history.userId || 'N/A' }}</td>
            <td>{{ history.salesDate || 'N/A' }}</td>
            <td>{{ formatCurrency(history.salesAmount || 0) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-arrow"
      >
        &lt;
      </button>
      <span
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{ active: currentPage === page }"
        class="pagination-page"
      >
        {{ page }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
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
      salesHistories: [], // 항상 배열로 초기화
      currentPage: 1, // 현재 페이지
      pageSize: 10, // 페이지당 항목 수
      totalPages: 1, // 전체 페이지 수
      searchQuery: '', // 검색어
    }
  },
  created() {
    this.fetchSalesHistory()
  },
  methods: {
    async fetchSalesHistory() {
      try {
        const response = await apiservice.allSalesHistoty(
          this.currentPage - 1,
          this.pageSize
        )
        console.log(
          'API 요청 URL:',
          `/sales/all?page=${this.currentPage - 1}&size=${this.pageSize}`
        )
        console.log('API 응답 데이터:', response.data)

        this.salesHistories = response.data.data.content || []
        this.totalPages = response.data.data.totalPages || 1
      } catch (error) {
        console.error('판매 이력을 가져오는 중 오류 발생:', error)
        this.salesHistories = []
        this.totalPages = 1
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchSalesHistory()
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchSalesHistory()
        console.log('이전 페이지:', this.currentPage)
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchSalesHistory()
        console.log('다음 페이지:', this.currentPage)
      }
    },
    setPage(page) {
      this.currentPage = page
      this.fetchSalesHistory()
      console.log('현재 페이지 설정:', this.currentPage)
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(value)
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
