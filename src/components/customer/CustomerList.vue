<template>
  <div class="customer-list">
    <h2>고객사 목록</h2>

    <!-- 검색 및 필터 아이콘 -->
    <div class="header">
      <div class="search-filter-container">
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

      <!-- 고객사 등록 버튼 -->
      <button @click="openForm(false)" class="jump-button">고객사 등록</button>
    </div>

    <!-- 필터 섹션 -->
    <div v-if="showFilters" class="filters">
      <!-- 정렬 필터 -->
      <div class="filter-group">
        <select
          id="sortOrder"
          v-model="sortOrder"
          @change="fetchCustomers"
          class="filter-select"
        >
          <option value="asc">고객사명⬆️</option>
          <option value="desc">고객사명⬇️</option>
        </select>
      </div>
      <!-- 거래 상태 필터 -->
      <div class="filter-group">
        <select
          id="transactionStatusFilter"
          v-model="transactionStatusFilter"
          @change="handleSearch"
          class="filter-select"
        >
          <option value="">거래상태</option>
          <option value="거래중">거래중</option>
          <option value="거래중지">거래중지</option>
        </select>
      </div>
    </div>

    <!-- 고객사 목록 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>고객사명</th>
            <th>고객사 번호</th>
            <th>고객사 담당자</th>
            <th>고객사 담당자 연락처</th>
            <th>고객사 주소</th>
            <th>거래상태</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedCustomers.length === 0">
            <td colspan="5">고객사가 존재하지 않습니다.</td>
          </tr>
          <tr
            v-for="(customer, index) in paginatedCustomers || []"
            :key="customer.customerId"
            @click="viewCustomerDetails(customer)"
            class="clickable-row"
          >
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ customer.customerName }}</td>
            <td>{{ customer.customerPhone }}</td>
            <td>{{ customer.customerPersonName }}</td>
            <td>{{ customer.customerPersonPhone }}</td>
            <td>
              <span class="ellipsis">{{
                truncatedAddress(customer.customerAddress)
              }}</span>
            </td>
            <td>
              <span
                class="status"
                :class="{
                  active: customer.customerStatus === '거래중',
                  inactive: customer.customerStatus === '거래중지',
                }"
              >
                {{ customer.customerStatus }}
              </span>
            </td>
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

    <!-- 고객사 세부 정보 모달 -->
    <CustomerDetailModal
      v-if="showCustomerDetailModal"
      :customerDetails="selectedCustomer"
      @close="closeCustomerDetailModal"
      @edit="openEditForm"
    />

    <!-- 고객사 등록/수정 모달 -->
    <CustomerForm
      v-if="showForm"
      :customerData="selectedCustomer"
      :isEditMode="isEditMode"
      @close="closeForm"
      @registered="fetchCustomers"
    />

    <!-- 삭제 확인 모달 -->
    <ConfirmModal
      v-if="showDeleteModalFlag"
      @close="hideDeleteModal"
      @confirm="confirmDelete"
      :message="
        '정말로 ' +
        selectedCustomer.customerName +
        ' 고객사를 삭제하시겠습니까?'
      "
    />
  </div>
</template>

<script>
import apiService from '@/api/apiService'
import CustomerForm from './CustomerForm.vue'
import ConfirmModal from '../ConfirmModal.vue'
import CustomerDetailModal from './CustomerDetailModal.vue'

export default {
  components: { CustomerForm, ConfirmModal, CustomerDetailModal },
  data() {
    return {
      customers: [],
      searchQuery: '',
      transactionStatusFilter: '', // 거래 상태 필터
      currentPage: 1,
      pageSize: 10,
      showForm: false,
      showCustomerDetailModal: false,
      showFilters: false, // 필터 섹션 표시 여부
      dropdownIndex: null,
      dropdownStyle: {}, // 드롭다운 위치 스타일
      showDeleteModalFlag: false,
      selectedCustomer: null, // 선택된 고객사 정보를 저장
      isEditMode: false, // 수정 모드 여부 확인 플래그
      sortOrder: 'asc',
    }
  },
  computed: {
    filteredCustomers() {
      let filtered = this.customers
      if (this.searchQuery) {
        filtered = filtered.filter(
          customer =>
            customer.customerName.includes(this.searchQuery) ||
            customer.customerPersonName.includes(this.searchQuery)
        )
      }
      if (this.transactionStatusFilter) {
        filtered = filtered.filter(
          customer => customer.customerStatus === this.transactionStatusFilter
        )
      }
      // 정렬을 적용
      return filtered.sort((a, b) => {
        const nameA = a.customerName || ''
        const nameB = b.customerName || ''
        if (this.sortOrder === 'asc') {
          return nameA.localeCompare(nameB, 'ko') // 한국어 정렬
        } else {
          return nameB.localeCompare(nameA, 'ko') // 역순 정렬
        }
      })
    },
    totalPages() {
      return Math.ceil(this.filteredCustomers.length / this.pageSize)
    },
    paginatedCustomers() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredCustomers.slice(start, end)
    },
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters
    },
    async fetchCustomers() {
      try {
        const response = await apiService.fetchCustomerList2({
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: `customerName,${this.sortOrder}`,
        })

        this.customers = response.data.content
        this.totalPages = response.data.totalPages
      } catch (error) {
        console.error('고객사 목록을 불러오는 중 오류 발생:', error)
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchCustomers()
    },
    openForm(isEdit = false) {
      this.isEditMode = isEdit
      this.showForm = true
      if (!isEdit) {
        this.selectedCustomer = {}
      }
    },
    viewCustomerDetails(customer) {
      this.selectedCustomer = customer
      this.showCustomerDetailModal = true
    },
    closeCustomerDetailModal() {
      this.showCustomerDetailModal = false
    },
    openEditForm(customer) {
      this.selectedCustomer = customer
      this.isEditMode = true
      this.showForm = true
      this.showCustomerDetailModal = false
    },
    closeForm() {
      this.showForm = false
      this.selectedCustomer = null
    },
    truncatedAddress(address) {
      return address.length > 20 ? address.substring(0, 20) + '...' : address
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchCustomers()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchCustomers()
      }
    },
    setPage(page) {
      this.currentPage = page
      this.fetchCustomers()
    },
  },
  mounted() {
    this.fetchCustomers()
  },
}
</script>

<style scoped>
.customer-list {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto;
}

.customer-list::-webkit-scrollbar {
  display: none;
}
.customer-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
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

.right-controls {
  display: flex;
  gap: 10px; /* 버튼과 필터 사이 간격 */
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

/* 테이블 스타일 */
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
  white-space: nowrap;
}
.ellipsis {
  display: inline-block;
  max-width: 200px; /* 제한된 너비 설정 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
th {
  background-color: #f4f4f4;
  font-weight: bold;
}
.action-cell {
  position: relative;
}
.dropdown-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.dropdown-menu {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100px;
  z-index: 10;
}
.dropdown-menu button {
  background: none;
  border: none;
  padding: 5px;
  text-align: left;
  cursor: pointer;
}
.dropdown-menu button:hover {
  background-color: #f0f0f0;
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 5px; /* 버튼 간격 */
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

.filter-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.filter-icon-button .fas {
  color: #4caf50;
}

.register-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
/* 필터 섹션 스타일 */
.filters {
  display: flex;
  align-items: center;
  gap: 20px; /* 필터 간 간격 */
  padding: 10px;
  background-color: #f9f9f9; /* 배경색 */
  border: 1px solid #ddd; /* 경계선 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  margin-bottom: 20px; /* 목록과 간격 추가 */
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-size: 14px;
  font-weight: bold;
  color: #333; /* 텍스트 색상 */
}

.filter-select {
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-select:focus {
  border-color: #3f72af;
  box-shadow: 0 0 4px rgba(63, 114, 175, 0.5);
  outline: none;
}

/* 필터 섹션 반응형 디자인 */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #f4f4f4;
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

.status {
  color: #fff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 10px;
    display: inline;
    text-align: center
}

.status.active {
  background-color: #4caf50; /* 녹색 */
}

.status.inactive {
  background-color: #f44336; /* 빨간색 */
}
</style>
