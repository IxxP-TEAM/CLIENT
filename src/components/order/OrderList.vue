<template>
  <div class="order-list">
    <h2>주문 목록</h2>

    <!-- 검색 및 필터 아이콘과 주문 등록 버튼 -->
    <div class="search-filter-container">
      <div class="search-filter-left">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색"
          @input="handleSearch"
          class="search-input"
        />

        <!-- 필터 아이콘 버튼 -->
        <button @click="toggleFilters" class="jump-button">
          <i class="fas fa-sliders-h"></i>
        </button>
      </div>

      <!-- 주문 등록 버튼 (오른쪽 정렬) -->
      <button @click="openOrderForm(false)" class="jump-button">
        주문 등록
      </button>
    </div>

    <!-- 필터 섹션 -->
    <div v-if="showFilters" class="filters">
      <!-- 주문 상태 필터 -->
      <select v-model="orderStatusFilter" @change="handleSearch" class="filter">
        <option value="">주문 상태</option>
        <option value="대기">대기</option>
        <option value="완료">완료</option>
        <option value="취소">취소</option>
      </select>

      <!-- 결제 상태 필터 -->
      <select
        v-model="paymentStatusFilter"
        @change="handleSearch"
        class="filter"
      >
        <option value="">결제 상태</option>
        <option value="결제완료">결제완료</option>
        <option value="미결제">미결제</option>
      </select>

      <!-- 배송 상태 필터 -->
      <select
        v-model="shippingStatusFilter"
        @change="handleSearch"
        class="filter"
      >
        <option value="">배송 상태</option>
        <option value="미출발">미출발</option>
        <option value="배송중">배송중</option>
        <option value="배송완료">배송완료</option>
      </select>

      <!-- 정렬 필터 -->
      <select
        id="sortOrder"
        v-model="sortOrder"
        @change="fetchOrders"
        class="filter"
      >
        <option value="asc">고객사명⬆️</option>
        <option value="desc">고객사명⬇️</option>
      </select>

      <!-- 날짜 필터 -->
      <div class="date-filter">
        <input type="date" v-model="selectedDate" @change="handleSearch" />
      </div>
    </div>

    <!-- 주문 목록 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>주문 번호</th>
            <th>주문일</th>
            <th>고객사명</th>
            <th>상태</th>
            <th>총 금액</th>
            <th>결제 상태</th>
            <th>배송 상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedOrders.length === 0">
            <td colspan="8">주문 목록이 없습니다.</td>
          </tr>
          <tr
            v-for="(order, index) in paginatedOrders"
            :key="order.orderId"
            @click="openOrderDetail(order)"
            class="clickable-row"
          >
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ order.orderDate || '' }}</td>
            <td>{{ order.customerName || 'N/A' }}</td>
            <td>{{ order.orderStatus || '' }}</td>
            <td>
              {{ formatCurrency(order.totalAmount || 0).toLocaleString() }}
            </td>
            <td>{{ order.paymentStatus || '' }}</td>
            <td>{{ order.shippingStatus || '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <!-- 이전 버튼 -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-arrow"
      >
        &lt;
      </button>

      <!-- 페이지 번호 -->
      <span
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{ active: currentPage === page }"
        class="pagination-page"
      >
        {{ page }}
      </span>

      <!-- 다음 버튼 -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-arrow"
      >
        &gt;
      </button>
    </div>

    <!-- 주문 등록/수정 모달 -->
    <OrderForm
      v-if="showOrderForm"
      :orderData="selectedOrder"
      :isEditMode="isEditMode"
      @close="closeOrderForm"
      @registered="fetchOrders"
    />
  </div>

  <!-- 주문 세부사항 모달 -->
  <OrderDetailModal
    v-if="showOrderDetailModal"
    :order="selectedOrder"
    @close="closeOrderDetail"
  />

  <OrderDetailModal
    v-if="showOrderDetailModal"
    :order="selectedOrder"
    @close="closeOrderDetail"
    @edit="openOrderFormForEdit"
  />
</template>

<script>
import apiService from '@/api/apiService'
import OrderForm from './OrderForm.vue'
import OrderDetailModal from './OrderDetailModal.vue'

export default {
  components: { OrderForm, OrderDetailModal },
  data() {
    return {
      orders: [],
      searchQuery: '',
      orderStatusFilter: '',
      paymentStatusFilter: '',
      shippingStatusFilter: '',
      selectedDate: '', // 선택한 날짜 필터
      currentPage: 1,
      pageSize: 10,
      showOrderForm: false,
      selectedOrder: null,
      isEditMode: false,
      sortOrder: 'asc',
      showFilters: false,
      customerNames: {},
      showOrderDetailModal: false,
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders.filter(order => {
        const matchesCustomerName =
          order.customerName && order.customerName.includes(this.searchQuery)
        const matchesOrderStatus =
          !this.orderStatusFilter ||
          order.orderStatus === this.orderStatusFilter
        const matchesPaymentStatus =
          !this.paymentStatusFilter ||
          order.paymentStatus === this.paymentStatusFilter
        const matchesShippingStatus =
          !this.shippingStatusFilter ||
          order.shippingStatus === this.shippingStatusFilter

        // 선택한 날짜와 일치하는 주문만 표시
        const matchesSelectedDate =
          !this.selectedDate || order.orderDate === this.selectedDate

        return (
          matchesCustomerName &&
          matchesOrderStatus &&
          matchesPaymentStatus &&
          matchesShippingStatus &&
          matchesSelectedDate
        )
      })

      // 고객사 이름으로 정렬
      if (this.sortOrder === 'asc') {
        filtered.sort((a, b) => a.customerName.localeCompare(b.customerName))
      } else if (this.sortOrder === 'desc') {
        filtered.sort((a, b) => b.customerName.localeCompare(a.customerName))
      }

      return filtered
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredOrders.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.pageSize)
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(value)
    },
    openOrderFormForEdit(order) {
      this.selectedOrder = order // 수정할 주문 정보 설정
      this.isEditMode = true // 수정 모드 활성화
      this.showOrderDetailModal = false // 주문 상세 모달 닫기
      this.showOrderForm = true // 주문 폼 열기
    },
    closeOrderDetail() {
      this.showOrderDetailModal = false
      this.selectedOrder = null
    },
    openOrderForm(isEdit = false) {
      this.isEditMode = isEdit
      this.showOrderForm = true
      if (!isEdit) {
        this.selectedOrder = {}
      }
    },
    closeOrderForm() {
      this.showOrderForm = false
      this.selectedOrder = null
    },
    toggleFilters() {
      this.showFilters = !this.showFilters
    },
    openOrderDetail(order) {
      this.selectedOrder = order
      this.showOrderDetailModal = true
    },
    async fetchOrders() {
      try {
        const response = await apiService.fetchOrderList(
          0,
          1000,
          this.sortOrder
        )
        const orderData = response.data.data.content || []
        const customerIds = orderData.map(order => order.customerId)
        const uniqueCustomerIds = [...new Set(customerIds)]

        // 고객사 이름 매핑
        const namesResponse = await apiService.fetchCustomerNames(
          uniqueCustomerIds
        )
        if (Array.isArray(namesResponse.data.data)) {
          this.customerNames = namesResponse.data.data.reduce(
            (acc, customer) => {
              acc[customer.customerId] = customer.customerName
              return acc
            },
            {}
          )
        } else {
          console.error('API 응답 형식이 예상과 다릅니다:', namesResponse.data)
          this.customerNames = {}
        }
        // 유저 이름 매핑
        const usersResponse = await apiService.fetchUserList()

        // usersResponse.data.data의 정확한 구조 확인
        const userData = usersResponse.data.data
        if (userData && Array.isArray(userData.items)) {
          // items 배열이 있는 경우, 유저 데이터를 매핑
          this.userNames = userData.items.reduce((acc, user) => {
            acc[user.userIdx] = user.name // userId 대신 userIdx를 사용하여 매핑
            return acc
          }, {})
        } else {
          console.error(
            '유저 API 응답 형식이 예상과 다릅니다:',
            usersResponse.data
          )
          this.userNames = {}
        }

        // 주문 데이터와 고객사 및 유저 정보를 결합
        this.orders = orderData.map(order => {
          const customerName = this.customerNames[order.customerId] || 'N/A'
          const userName = this.userNames[order.userId] || 'N/A'

          return {
            ...order,
            customerName,
            userName,
            orderProducts: order.orderProducts || [],
          }
        })
      } catch (error) {
        console.error('주문 목록을 불러오는 중 오류 발생:', error)
      }
    },
    handleSearch() {
      this.currentPage = 1 // 검색어 변경 시 첫 페이지로 이동
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    setPage(page) {
      this.currentPage = page
    },
  },
  mounted() {
    this.fetchOrders()
  },
}
</script>

<style scoped>
.clickable-row {
  cursor: pointer;
}
.clickable-row:hover {
  background-color: #f4f4f4; /* 마우스 hover 시 배경 색상 */
}

.order-list {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto;
}

.order-list::-webkit-scrollbar {
  display: none;
}
.order-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.header input[type='text'] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
}

.right-controls {
  display: flex;
  gap: 10px;
}

.right-controls select.filter {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.header button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
/* 필터 토글 버튼 스타일 */
.filter-toggle {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}
/* 검색 및 필터 아이콘 스타일 */
.search-filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.search-filter-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 8px;
  font-size: 16px;
  width: 300px;
}

.filter-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.filter-icon-button .fas {
  color: #4caf50;
}

.filters {
  display: flex;
  align-items: center;
  gap: 15px; /* 필터 간 간격 */
  padding: 15px;
  background-color: #f9f9f9; /* 필터 배경 색상 */
  border: 1px solid #ddd; /* 경계선 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  margin-bottom: 20px; /* 테이블과 간격 */
}

.filters select.filter {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
}

.filters .date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filters .date-filter label {
  font-size: 14px;
  color: #333;
}

.filters .date-filter input[type='date'] {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
}

.table-container {
  margin-top: 10px; /* 테이블과 필터 간 간격 */
}

.register-button {
  font-size: 18px; /* 버튼 텍스트 크기 강조 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.register-button:hover {
  background-color: #4c51bf;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 강화 */
}

.table-container {
  overflow-x: auto;
}
.table-container::-webkit-scrollbar {
  display: none;
}
.table-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
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

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 8px; /* 버튼과 번호 간의 간격 */
}

.pagination-page {
  font-size: 16px;
  font-weight: bold;
  color: #3f72af; /* 기본 색상 */
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
}

.pagination-arrow {
  font-size: 24px; /* 꺾쇠 크기 */
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
  color: #b0b0b0; /* 비활성화 상태 */
  cursor: not-allowed;
  transform: none;
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
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}
</style>
