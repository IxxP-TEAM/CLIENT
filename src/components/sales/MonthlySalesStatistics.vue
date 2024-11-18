<template>
    <div class="daily-sales">
      <h2>기간별 매출 통계</h2>
  
      <!-- 기간 선택 -->
      <div class="header">
        <label for="start-date">시작 날짜:</label>
        <input id="start-date" type="date" v-model="dateRange.startDate" />
  
        <label for="end-date">종료 날짜:</label>
        <input id="end-date" type="date" v-model="dateRange.endDate" />
  
        <button @click="handleSearch" class="search-button">검색</button>
      </div>
  
      <!-- 테이블 -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>월</th>
              <th>총 매출</th>
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
  
      <!-- 차트 -->
      <div v-if="dailySales.length > 0" class="chart-container">
        <canvas id="dailySalesChart"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { Chart } from "chart.js";
  import apiService from "@/api/apiService";
  
  export default {
    data() {
      return {
        dateRange: {
          startDate: "",
          endDate: "",
        },
        dailySales: [], // 월별 그룹화된 데이터 (그래프용)
        chart: null, // Chart.js 인스턴스
      };
    },
    methods: {
      async handleSearch() {
        // 시작 날짜와 종료 날짜가 모두 입력되었을 때만 호출
        if (!this.dateRange.startDate || !this.dateRange.endDate) {
          alert("날짜를 선택하세요.");
          return;
        }
  
        try {
          // 데이터를 가져오는 작업 완료 후 차트 렌더링
          await this.fetchDailySales();
          this.renderChart();
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        }
      },
      async fetchDailySales() {
        const response = await apiService.getDailySalesStatistics(this.dateRange);
        const groupedData = response.data.data.reduce((acc, sale) => {
          const date = new Date(sale.salesDate.trim().replace(/-/g, "/"));
          if (isNaN(date)) {
            console.error(`Invalid date string: ${sale.salesDate}`);
            return acc;
          }
          const yearMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          if (!acc[yearMonth]) {
            acc[yearMonth] = 0;
          }
          acc[yearMonth] += sale.totalSales;
          return acc;
        }, {});
  
        // 목록 데이터 업데이트
        this.dailySales = Object.entries(groupedData).map(
          ([yearMonth, totalSales]) => ({
            yearMonth,
            totalSales,
          })
        );
      },
      renderChart() {
        if (this.chart) {
          this.chart.destroy();
        }
  
        const ctx = document.getElementById("dailySalesChart").getContext("2d");
        this.chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.dailySales.map((sales) => sales.yearMonth),
            datasets: [
              {
                label: "월별 매출",
                data: this.dailySales.map((sales) => sales.totalSales),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
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
                  text: "매출 금액 (₩)",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "월",
                },
              },
            },
          },
        });
      },
      formatCurrency(value) {
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(value);
      },
    },
  };
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
    gap: 20px;
    margin-bottom: 20px;
    align-items: center;
  }
  
  label {
    font-size: 16px;
  }
  
  input[type="date"] {
    padding: 8px;
    font-size: 16px;
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
  
  .chart-container {
    margin-top: 20px;
  }
  </style>
  