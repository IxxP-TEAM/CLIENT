<template>
  <div class="daily-sales">
    <h2>기간별 매출 통계</h2>

    <!-- 기간 선택 -->
    <div class="header">
      <input
        id="start-date"
        type="date"
        v-model="dateRange.startDate"
        placeholder="시작 날짜"
      />

      <input
        id="end-date"
        type="date"
        v-model="dateRange.endDate"
        placeholder="종료 날짜"
      />

      <!-- 검색 버튼 -->
      <button @click="handleSearch" class="jump-button">검색</button>
    </div>

    <!-- 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('yearMonth')">
              월
              <span v-if="sortField === 'yearMonth'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('totalSales')">
              총 매출
              <span v-if="sortField === 'totalSales'">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- 데이터 없을 때 -->
          <tr v-if="dailySales.length === 0">
            <td colspan="2">날짜를 입력하세요.</td>
          </tr>
          <!-- 데이터 있을 때 -->
          <tr v-for="(sales, index) in dailySales" :key="index">
            <td>{{ sales.yearMonth }}</td>
            <td>{{ formatCurrency(sales.totalSales) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="summary">
      <p>총 매출: {{ formatCurrency(totalSales) }}</p>
      <p>평균 매출: {{ formatCurrency(averageSales) }}</p>
      <p>최대 매출: {{ formatCurrency(maxSales) }}</p>
      <p>최소 매출: {{ formatCurrency(minSales) }}</p>
    </div>

    <!-- 차트 -->
    <div v-if="dailySales.length > 0" class="chart-container">
      <canvas id="dailySalesChart"></canvas>
    </div>
  </div>
</template>
  
  <script>
import { Chart } from 'chart.js'
import apiService from '@/api/apiService'

export default {
  computed: {
    totalSales() {
      return this.dailySales.reduce((sum, sale) => sum + sale.totalSales, 0)
    },
    averageSales() {
      return this.dailySales.length > 0
        ? this.totalSales / this.dailySales.length
        : 0
    },
    maxSales() {
      return Math.max(...this.dailySales.map(sale => sale.totalSales))
    },
    minSales() {
      return Math.min(...this.dailySales.map(sale => sale.totalSales))
    },
  },

  data() {
    return {
      dateRange: {
        startDate: '',
        endDate: '',
      },
      dailySales: [], // 월별 그룹화된 데이터 (그래프용)
      chart: null, // Chart.js 인스턴스
      sortField: 'yearMonth', // 초기 정렬 필드
      sortOrder: 'asc', // 초기 정렬 방향 ('asc' 또는 'desc')
    }
  },
  methods: {
    sortBy(field) {
      if (this.sortField === field) {
        // 같은 필드를 다시 클릭하면 정렬 방향 변경
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        // 다른 필드 클릭 시 정렬 방향 초기화
        this.sortField = field
        this.sortOrder = 'asc'
      }

      // 정렬 로직
      this.dailySales.sort((a, b) => {
        if (field === 'totalSales') {
          return this.sortOrder === 'asc'
            ? a[field] - b[field]
            : b[field] - a[field]
        }
        return this.sortOrder === 'asc'
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field])
      })
    },
    async handleSearch() {
      if (!this.dateRange.startDate || !this.dateRange.endDate) {
        alert('날짜를 선택하세요.')
        return
      }

      try {
        await this.fetchDailySales()
        this.renderChart()
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error)
      }
    },
    async fetchDailySales() {
      const response = await apiService.getDailySalesStatistics(this.dateRange)
      const groupedData = response.data.data.reduce((acc, sale) => {
        const date = new Date(sale.salesDate.trim().replace(/-/g, '/'))
        if (isNaN(date)) {
          console.error(`Invalid date string: ${sale.salesDate}`)
          return acc
        }
        const yearMonth = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`
        if (!acc[yearMonth]) {
          acc[yearMonth] = 0
        }
        acc[yearMonth] += sale.totalSales
        return acc
      }, {})

      // 목록 데이터 업데이트
      this.dailySales = Object.entries(groupedData).map(
        ([yearMonth, totalSales]) => ({
          yearMonth,
          totalSales,
        })
      )
      // 기본 정렬 적용
      this.sortBy(this.sortField)
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy()
      }

      const ctx = document.getElementById('dailySalesChart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.dailySales.map(sales => sales.yearMonth),
          datasets: [
            {
              label: '매출',
              data: this.dailySales.map(sales => sales.totalSales),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '매출 금액 (₩)',
              },
            },
            x: {
              title: {
                display: true,
                text: '월',
              },
            },
          },
        },
      })
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
.daily-sales {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  -ms-overflow-style: none; /* IE 및 Edge에서 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
}

.daily-sales::-webkit-scrollbar {
  display: none; /* 웹킷 브라우저에서 스크롤바 숨기기 */
}

.header {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* 적절한 간격 추가 */
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f4f4f4; /* 배경색 추가 */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
}

label {
  font-size: 16px;
}

input[type='date'] {
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

input[type='date']:focus {
  border-color: #3f72af;
  box-shadow: 0 0 6px rgba(63, 114, 175, 0.5);
}

input[type='date']::placeholder {
  color: #b0b0b0; /* 플레이스홀더 색상 */
  font-style: italic;
}

.search-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 15px; /* 약간 더 큰 글꼴 크기 */
}

th,
td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 긴 텍스트 생략 표시 */
}

th {
  background-color: #3f72af; /* 강조된 헤더 색상 */
  color: white;
  font-weight: bold;
  font-size: 16px; /* 헤더는 더 크고 강렬하게 */
  cursor: pointer;
  position: relative;
  padding: 12px 16px;
  transition: background-color 0.3s ease, color 0.3s ease; /* 부드러운 전환 효과 */
}

th span {
  font-size: 12px; /* 화살표 크기 */
  margin-left: 5px;
}

th:hover {
  background-color: #3f72af; /* 헤더 호버 시 배경색 */
  color: white; /* 텍스트 색상 변경 */
  box-shadow: inset 0px -2px 5px rgba(0, 0, 0, 0.1); /* 헤더 강조 효과 */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* 교차 배경색 */
}

tr:hover {
  background-color: rgba(
    63,
    114,
    175,
    0.1
  ); /* 행 호버 시 부드러운 하이라이트 */
  cursor: pointer;
  transition: background-color 0.3s ease; /* 부드러운 전환 효과 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  font-weight: bold; /* 텍스트 강조 */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* 교차 배경색 */
}

tr:hover {
  background-color: #e9ecef; /* 호버 효과로 강조 */
}

.chart-container {
  margin-top: 20px;
}

.header input[type='date'] {
  flex: 1;
  min-width: 200px;
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
  transition: transform 0.2s ease, background-color 0.2s ease;
  margin-left: auto;
  align-self: center; /* 버튼의 정렬을 중앙으로 */
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}

.summary {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  gap: 20px; /* 항목 간 간격 */
}

.summary p {
  margin: 0;
  flex: 1;
  text-align: center;
}

.chart-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
  