<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard">
    <h2>홈 대시보드</h2>

    <!-- 맨 위 요약 정보와 공지 게시판 -->
    <div class="grid-container">
      <!-- 위젯 1: 요약 정보 -->
      <div class="widget summary-widget">
        <h3>요약 정보</h3>
        <div class="summary-item">
          <i class="fas fa-money-bill-wave"></i>
          <span>총 매출:</span>
          {{ formatCurrency(totalSales) }}
        </div>
        <div class="summary-item">
          <i class="fas fa-building"></i>
          <span>총 고객사:</span>
          {{ totalCustomers }}
        </div>
        <div class="summary-item">
          <i class="fas fa-user-tie"></i>
          <span>총 사원:</span>
          {{ totalSalespersons }}
        </div>
      </div>

      <!-- 위젯 2: 공지 게시판 -->
      <div class="widget board-widget">
        <h3 @click="goToBoardList">공지 게시판</h3>
        <hr />
        <ul class="notice-list">
          <li
            class="notice-item"
            v-for="(board, index) in notices"
            :key="index"
            @click="goToBoardDetail(board.boardId)"
          >
            <i class="notice-item-icon fas fa-bullhorn"></i>
            <span class="notice-item-title">{{ board.title }}</span>
            <span class="notice-item-date">{{
              new Date(board.createdAt).toLocaleDateString()
            }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 나머지 위젯 -->
    <div class="grid-container">
      <!-- 위젯 3: 상위 고객사 매출 -->
      <div class="widget top-customers-widget">
        <h3>상위 고객사 매출</h3>
        <hr />
        <div class="chart-container">
          <canvas id="topCustomersChart"></canvas>
        </div>
        <ul class="top-customers-list">
          <li
            class="top-customers-item"
            v-for="(customer, index) in topCustomers"
            :key="index"
          >
            <div class="customer-info">
              <span v-if="index === 0" class="customer-medal gold">🥇</span>
              <span v-else-if="index === 1" class="customer-medal silver"
                >🥈</span
              >
              <span v-else-if="index === 2" class="customer-medal bronze"
                >🥉</span
              >
              <span class="customer-name">{{ customer.customerId }}</span>
            </div>
            <span class="customer-sales">
              {{ formatCurrency(customer.totalSales) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- 위젯 4: 상위 사원 매출 -->
      <div class="widget top-salespersons-widget">
        <h3>상위 사원 매출</h3>
        <hr />
        <div class="chart-container">
          <canvas id="topSalespersonsChart"></canvas>
        </div>
        <ul class="top-salespersons-list">
          <li
            class="top-salespersons-item"
            v-for="(salesperson, index) in topSalespersons"
            :key="index"
          >
            <div class="salesperson-info">
              <span v-if="index === 0" class="salesperson-medal gold">🥇</span>
              <span v-else-if="index === 1" class="salesperson-medal silver"
                >🥈</span
              >
              <span v-else-if="index === 2" class="salesperson-medal bronze"
                >🥉</span
              >
              <span class="salesperson-name">{{ salesperson.userId }}</span>
            </div>
            <span class="salesperson-sales">
              {{ formatCurrency(salesperson.totalSales) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- 위젯 5: 기간별 고객사 매출 -->
      <div class="widget customer-sales-widget">
        <h3>기간별 고객사 매출</h3>
        <hr />
        <div class="chart-container">
          <canvas id="customerSalesChart"></canvas>
        </div>
        <ul class="customer-sales-list">
          <li
            class="customer-sales-item"
            v-for="(customer, index) in customerSales"
            :key="index"
          >
            <div class="customer-info">
              <span v-if="index === 0" class="customer-medal gold">🥇</span>
              <span v-else-if="index === 1" class="customer-medal silver"
                >🥈</span
              >
              <span v-else-if="index === 2" class="customer-medal bronze"
                >🥉</span
              >
              <span class="customer-name">{{ customer.customerId }}</span>
            </div>
            <span class="customer-sales">
              {{ formatCurrency(customer.totalSales) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- 위젯 6: 기간별 사원 매출 -->
      <div class="widget salesperson-sales-widget">
        <h3>기간별 사원 매출</h3>
        <hr />
        <div class="chart-container">
          <canvas id="salespersonSalesChart"></canvas>
        </div>
        <ul class="salesperson-sales-list">
          <li
            class="salesperson-sales-item"
            v-for="(salesperson, index) in salespersonSales"
            :key="index"
          >
            <div class="salesperson-info">
              <span v-if="index === 0" class="salesperson-medal gold">🥇</span>
              <span v-else-if="index === 1" class="salesperson-medal silver"
                >🥈</span
              >
              <span v-else-if="index === 2" class="salesperson-medal bronze"
                >🥉</span
              >
              <span class="salesperson-name">{{ salesperson.userName }}</span>
            </div>
            <span class="salesperson-sales">
              {{ formatCurrency(salesperson.totalSales) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- 위젯 7: 월별 매출 통계 -->
      <div class="widget monthly-sales-widget">
        <h3>월별 매출 통계</h3>
        <hr />
        <div class="monthly-sales-chart">
          <canvas id="monthlySalesChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { Chart } from 'chart.js'
import apiService from '@/api/apiService'

export default {
  data() {
    return {
      topCustomers: [],
      topSalespersons: [],
      customerSales: [],
      salespersonSales: [],
      monthlySales: [],
      totalSales: 0,
      totalCustomers: 0,
      totalSalespersons: 0,
      notices: [], // 공지 데이터 저장
      charts: {}, // 모든 차트를 관리
    }
  },
  methods: {
    goToBoardList() {
      this.$router.push({ name: 'BoardList', params: { type: 'NOTICE' } })
    },
    goToBoardDetail(boardId) {
      if (!boardId) {
        console.error('boardId가 없습니다:', boardId)
        return
      }
      this.$router.push({ name: 'BoardDetail', params: { id: boardId } })
    },
    async fetchDashboardData() {
      try {
        // 데이터 초기화
        this.topCustomers = []
        this.topSalespersons = []
        this.customerSales = []
        this.salespersonSales = []
        this.monthlySales = []
        this.totalSales = 0
        this.totalCustomers = 0
        this.totalSalespersons = 0
        this.notices = []

        // 공지사항 데이터 가져오기
        await this.fetchNotices()

        // 상위 고객사 매출
        const topCustomersResponse = await apiService.getTopCustomersBySales(5)
        this.topCustomers = (topCustomersResponse.data.data || []).slice(0, 5)

        // 상위 사원 매출
        const topSalespersonsResponse =
          await apiService.getTopSalespersonsBySales(5)
        this.topSalespersons = (topSalespersonsResponse.data.data || []).slice(
          0,
          5
        )

        // 고객사 매출 전체 데이터 가져오기
        const customerSalesResponse =
          await apiService.getTotalSalesByCustomerAndDate({
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          })

        // 사원 매출 전체 데이터 가져오기
        const salespersonSalesResponse =
          await apiService.getTotalSalesByUserAndDate({
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          })
        // 전체 데이터 확인
        const allCustomerSales = customerSalesResponse.data.data || []
        const allSalespersonSales = salespersonSalesResponse.data.data || []

        // 전체 길이를 기반으로 총합 계산
        this.totalCustomers = allCustomerSales.length // 총 고객사 수 = 전체 데이터 길이
        this.totalSalespersons = allSalespersonSales.length // 총 사원 수 = 전체 데이터 길이

        // UI에 상위 데이터만 표시 (상위 5개)
        this.customerSales = allCustomerSales.slice(0, 5) // 상위 5개 고객사
        this.salespersonSales = allSalespersonSales.slice(0, 5) // 상위 5개 사원

        // 월별 매출 통계
        const monthlySalesResponse = await apiService.getMonthlySalesStatistics(
          {
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          }
        )
        this.monthlySales = monthlySalesResponse.data.data || []

        // 요약 데이터 계산
        this.totalSales = this.monthlySales.reduce(
          (sum, sale) => sum + sale.totalSales,
          0
        )

        // 그래프 렌더링
        this.renderCharts()
      } catch (error) {
        console.error('대시보드 데이터를 가져오는 중 오류 발생:', error)
      }
    },
    async fetchNotices() {
      try {
        const response = await apiService.fetchBoardList(0, 40) // 모든 게시글 데이터 가져오기
        console.log('API 응답:', response)

        const allBoards = response?.data?.data?.content || []
        this.notices = allBoards
          .filter(board => board.isPinned) // `isPinned`인 게시글만 필터링
          .sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt)
            const timeB = new Date(b.updatedAt || b.createdAt)
            return timeB - timeA // 최신순 정렬
          })
          .slice(0, 3) // 상위 3개만

        // Vue 반응성 보장을 위해 새로운 배열 할당
        this.notices = [...this.notices]

        console.log('정렬 후 공지사항:', this.notices) // 정렬 결과 확인
      } catch (error) {
        console.error('공지 데이터를 가져오는 중 오류 발생:', error)
        this.notices = []
      }
    },
    renderCharts() {
      this.renderChart(
        'topCustomersChart',
        this.topCustomers,
        '고객사 매출',
        'customerId'
      )
      this.renderChart(
        'topSalespersonsChart',
        this.topSalespersons,
        '사원 매출',
        'userId'
      )
      this.renderChart(
        'customerSalesChart',
        this.customerSales,
        '고객사 매출',
        'customerId'
      )
      this.renderChart(
        'salespersonSalesChart',
        this.salespersonSales,
        '사원 매출',
        'userName'
      )
      this.renderChart(
        'monthlySalesChart',
        this.monthlySales,
        '월별 매출',
        'month',
        item => item.totalSales
      )
    },
    renderChart(canvasId, data, label, key, valueFn = item => item.totalSales) {
      const ctx = document.getElementById(canvasId).getContext('2d')

      // 기존 그래프 제거
      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy()
      }

      // 그래프 타입 결정 (월별 매출은 라인 그래프)
      const chartType = canvasId === 'monthlySalesChart' ? 'line' : 'bar'

      // 라인 그래프용 추가 옵션
      const lineOptions = {
        tension: 0.3, // 곡선 부드럽게 처리
        fill: false, // 그래프 아래 채우기 비활성화
      }

      this.charts[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
          labels: data.map(item => item[key]), // 라벨
          datasets: [
            {
              label,
              data: data.map(valueFn), // 데이터 값
              backgroundColor:
                chartType === 'line'
                  ? 'rgba(75, 192, 192, 0.2)'
                  : 'rgba(75, 192, 192, 0.2)', // 막대 또는 포인트 색상
              borderColor: 'rgba(75, 192, 192, 1)', // 테두리 색상
              borderWidth: 2,
              ...(chartType === 'line' ? lineOptions : {}),
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
                text: key === 'month' ? '월' : '',
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
  mounted() {
    this.fetchDashboardData()
  },
}
</script>
  
  <style scoped>
.dashboard {
  padding: 20px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.dashboard::-webkit-scrollbar {
  display: none;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.widget {
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.large-widget {
  grid-column: span 2;
}

.summary-widget {
  background: linear-gradient(135deg, #f6f9fc, #ffffff);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  text-align: center;
}

.summary-widget h3 {
  font-size: 20px;
  font-weight: bold;
  color: #4a90e2;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  color: #333;
  padding: 10px 1px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%;
  max-width: 200px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
}

.summary-item:hover {
  transform: scale(1.05);
}

.summary-item i {
  font-size: 20px;
  color: #4a90e2;
}

.summary-item span {
  font-weight: bold;
  font-size: 18px;
  color: #555;
}

.widget h3 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.widget ul {
  list-style: none;
  padding: 0;
  margin: 15px 0 0;
}

.widget li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  margin-bottom: 8px;
  font-size: 14px;
  transition: background-color 0.2s ease-in-out;
}

.widget li:hover {
  background-color: #f0f8ff;
}

.medal {
  margin-right: 8px;
  font-size: 16px;
  flex-shrink: 0;
}

.widget li span {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.widget li:last-child {
  margin-bottom: 0;
}

.widget li:nth-child(odd) {
  background-color: #f9f9f9;
}

.widget ul li {
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget ul li:last-child {
  border-bottom: none;
}

.widget ul li:hover {
  background-color: #f0f8ff;
  cursor: pointer;
}
h3[style] {
  text-decoration: underline;
  font-weight: bold;
}

.board-widget {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  grid-column: span 2;
}

.board-widget h3 {
  font-size: 22px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
  cursor: pointer;
  text-align: center;
}

.board-widget hr {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notice-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}

.notice-item:hover {
  background-color: #f0f8ff;
  transform: scale(1.02);
}

.notice-item-icon {
  font-size: 24px;
  color: #4a90e2;
  margin-right: 15px;
}

.notice-item-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-item-date {
  font-size: 12px;
  color: #888;
}

.monthly-sales-widget {
  background: linear-gradient(135deg, #ffffff, #f0f8ff);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  grid-column: span 2;
}

.monthly-sales-chart {
  width: 100%;
  height: 550px; 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.monthly-sales-widget h3 {
  font-size: 22px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.monthly-sales-widget hr {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.chart-container {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-container canvas {
  max-width: 100%;
  height: auto;
}

.chart-tooltip {
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 12px;
}

.chart-container:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.salesperson-sales-widget {
  background: linear-gradient(135deg, #ffffff, #f0f8ff);
  padding: 15px; 
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px; 
}

.salesperson-sales-widget h3 {
  font-size: 18px; 
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 5px; 
}

.salesperson-sales-widget hr {
  margin: 5px 0; 
  border: none;
  border-top: 1px solid #ddd;
}

.salesperson-sales-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px; 
}

.salesperson-sales-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px; 
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); 
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}

.salesperson-sales-item:hover {
  background-color: #f0f8ff;
  transform: scale(1.02);
}


.salesperson-medal {
  font-size: 18px; 
  margin-right: 10px; 
}

.salesperson-info {
  display: flex;
  align-items: center;
  gap: 8px; 
}

.salesperson-name {
  font-size: 14px; 
  font-weight: bold;
  color: #333;
}

.salesperson-sales {
  font-size: 14px; 
  font-weight: bold;
  color: #4a90e2;
}


.customer-sales-widget {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.customer-sales-widget h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin: 0 0 10px 0;
}

.customer-sales-widget hr {
  margin: 5px 0;
  border: none;
  border-top: 1px solid #ddd;
}

/* 리스트 스타일 */
.customer-sales-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 고객사 매출 항목 스타일 */
.customer-sales-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}

.customer-sales-item:hover {
  background-color: #f0f8ff;
  transform: scale(1.02);
}


.customer-medal {
  font-size: 18px;
  margin-right: 10px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-name {
  flex-grow: 1; 
  text-align: left; 
  margin-right: 10px; 
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.customer-sales {
  text-align: right; 
  font-size: 14px;
  font-weight: bold;
  color: #4a90e2;
}

.top-salespersons-widget {
  background: linear-gradient(135deg, #ffffff, #f9f9fc);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-salespersons-widget h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin: 0 0 10px 0;
}

.top-salespersons-widget hr {
  margin: 5px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.top-salespersons-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-salespersons-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}

.top-salespersons-item:hover {
  background-color: #f0f8ff;
  transform: scale(1.02);
}

.salesperson-medal {
  font-size: 18px;
  margin-right: 10px;
}

.salesperson-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.salesperson-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.salesperson-sales {
  font-size: 14px;
  font-weight: bold;
  color: #4a90e2;
}

.top-customers-widget {
  background: linear-gradient(135deg, #ffffff, #f9f9fc);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-customers-widget h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin: 0 0 10px 0;
}

.top-customers-widget hr {
  margin: 5px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.top-customers-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-customers-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}

.top-customers-item:hover {
  background-color: #f0f8ff;
  transform: scale(1.02);
}

.customer-medal {
  font-size: 18px;
  margin-right: 10px;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.customer-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.customer-sales {
  font-size: 14px;
  font-weight: bold;
  color: #4a90e2;
}
</style>
  