<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard">
    <h2>홈 대시보드</h2>

    <div class="grid-container">
      <!-- 위젯 1: 상위 고객사 매출 -->
      <div class="widget">
        <h3>상위 고객사 매출</h3>
        <canvas id="topCustomersChart"></canvas>
        <ul>
          <li v-for="(customer, index) in topCustomers" :key="index">
            <span v-if="index === 0" class="medal gold">🥇</span>
            <span v-else-if="index === 1" class="medal silver">🥈</span>
            <span v-else-if="index === 2" class="medal bronze">🥉</span>
            {{ customer.customerId }}: {{ formatCurrency(customer.totalSales) }}
          </li>
        </ul>
      </div>

      <!-- 위젯 2: 상위 사원 매출 -->
      <div class="widget">
        <h3>상위 사원 매출</h3>
        <canvas id="topSalespersonsChart"></canvas>
        <ul>
          <li v-for="(salesperson, index) in topSalespersons" :key="index">
            <span v-if="index === 0" class="medal gold">🥇</span>
            <span v-else-if="index === 1" class="medal silver">🥈</span>
            <span v-else-if="index === 2" class="medal bronze">🥉</span>
            {{ salesperson.userId }}:
            {{ formatCurrency(salesperson.totalSales) }}
          </li>
        </ul>
      </div>

      <!-- 위젯 3: 기간별 고객사 매출 -->
      <div class="widget">
        <h3>기간별 고객사 매출</h3>
        <canvas id="customerSalesChart"></canvas>
        <ul>
          <li v-for="(customer, index) in customerSales" :key="index">
            <span v-if="index === 0" class="medal gold">🥇</span>
            <span v-else-if="index === 1" class="medal silver">🥈</span>
            <span v-else-if="index === 2" class="medal bronze">🥉</span>
            {{ customer.customerId }}: {{ formatCurrency(customer.totalSales) }}
          </li>
        </ul>
      </div>

      <!-- 위젯 4: 기간별 사원 매출 -->
      <div class="widget">
        <h3>기간별 사원 매출</h3>
        <canvas id="salespersonSalesChart"></canvas>
        <ul>
          <li v-for="(salesperson, index) in salespersonSales" :key="index">
            <span v-if="index === 0" class="medal gold">🥇</span>
            <span v-else-if="index === 1" class="medal silver">🥈</span>
            <span v-else-if="index === 2" class="medal bronze">🥉</span>
            {{ salesperson.userName }}:
            {{ formatCurrency(salesperson.totalSales) }}
          </li>
        </ul>
      </div>

      <!-- 위젯 5: 월별 매출 통계 -->
      <div class="widget large-widget">
        <h3>월별 매출 통계</h3>
        <canvas id="monthlySalesChart"></canvas>
      </div>

      <!-- 위젯 6: 요약 정보 -->
      <div class="widget summary-widget">
        <h3>요약 정보</h3>
        <p>총 매출: {{ formatCurrency(totalSales) }}</p>
        <p>총 고객사: {{ totalCustomers }}</p>
        <p>총 사원: {{ totalSalespersons }}</p>
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
      charts: {}, // 모든 차트를 관리
    }
  },
  methods: {
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

        // 상위 고객사 매출
        const topCustomersResponse = await apiService.getTopCustomersBySales(5)
        this.topCustomers = topCustomersResponse.data.data || []

        // 상위 사원 매출
        const topSalespersonsResponse =
          await apiService.getTopSalespersonsBySales(5)
        this.topSalespersons = topSalespersonsResponse.data.data || []

        // 기간별 고객사 매출
        const customerSalesResponse =
          await apiService.getTotalSalesByCustomerAndDate({
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          })
        this.customerSales = (customerSalesResponse.data.data || []).slice(0, 5) // 상위 5개만

        // 기간별 사원 매출
        const salespersonSalesResponse =
          await apiService.getTotalSalesByUserAndDate({
            startDate: '2024-01-01',
            endDate: '2024-12-31',
          })
        this.salespersonSales = (
          salespersonSalesResponse.data.data || []
        ).slice(0, 5) // 상위 5개만

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
        this.totalCustomers = this.customerSales.length
        this.totalSalespersons = this.salespersonSales.length

        // 그래프 렌더링
        this.renderCharts()
      } catch (error) {
        console.error('대시보드 데이터를 가져오는 중 오류 발생:', error)
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
  grid-column: span 1;
}

.widget h3 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 목록 스타일 개선 */
.widget ul {
  list-style: none;
  padding: 0;
  margin: 15px 0 0;
}

.widget li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
</style>
  