<template>
  <div class="customer-list">
    <h2>고객사 목록</h2>
    <div class="header">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="검색"
        @input="handleSearch"
      />
      <button @click="openForm(false)">고객사 등록</button>
    </div>
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
            <th>고객사 거래상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(customer, index) in paginatedCustomers || []"
            :key="customer.customerId"
          >
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td @click="viewCustomerDetails(customer)" class="clickable">{{ customer.customerName }}</td>
            <td>{{ customer.customerPhone }}</td>
            <td>{{ customer.customerPersonName }}</td>
            <td>{{ customer.customerPersonPhone }}</td>
            <td>
              <span class="ellipsis">{{ truncatedAddress(customer.customerAddress) }}</span>
            </td>
            <td>{{ customer.customerStatus }}</td>
            <td class="action-cell">
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-arrow">&lt;</button>
      <span
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{ active: currentPage === page }"
        class="pagination-page"
      >
        {{ page }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-arrow">
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
      currentPage: 1,
      pageSize: 10,
      showForm: false,
      showCustomerDetailModal: false,
      dropdownIndex: null,
      dropdownStyle: {}, // 드롭다운 위치 스타일
      showDeleteModalFlag: false,
      selectedCustomer: null, // 선택된 고객사 정보를 저장
      isEditMode: false, // 수정 모드 여부 확인 플래그
    }
  },
  computed: {
    filteredCustomers() {
      if (!this.searchQuery) {
        return this.customers
      }
      return this.customers.filter(
        customer =>
          customer.customerName.includes(this.searchQuery) ||
          customer.customerPersonName.includes(this.searchQuery)
      )
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
    truncatedAddress(address) {
      return address.length > 20 ? address.substring(0, 20) + '...' : address;
    },
    async fetchCustomers() {
      try {
        const response = await apiService.fetchCustomerList()
        this.customers = Array.isArray(response.data.data)
          ? response.data.data
          : []
      } catch (error) {
        console.error('고객사 목록을 불러오는 중 오류 발생:', error)
      }
    },
    handleSearch() {
      this.currentPage = 1
    },
    openForm(isEdit = false) {
      this.isEditMode = isEdit;
      this.showForm = true;
      if (!isEdit) {
        this.selectedCustomer = {}; // 등록 모드일 때 selectedCustomer 초기화
      }
    },
    viewCustomerDetails(customer) {
      this.selectedCustomer = customer;
      this.showCustomerDetailModal = true;
    },
    closeCustomerDetailModal() {
      this.showCustomerDetailModal = false;
    },
    openEditForm(customer) {
      this.selectedCustomer = customer;
      this.isEditMode = true;
      this.showForm = true;
      this.showCustomerDetailModal = false;
    },
    closeForm() {
      this.showForm = false;
      this.selectedCustomer = null;
    },
    editCustomer(customer) {
      this.selectedCustomer = { ...customer }; // 복사본 생성
      this.openForm(true); // 수정 모드로 열기
    },
    toggleDropdown(index, event) {
      if (this.dropdownIndex === index) {
        this.dropdownIndex = null;
      } else {
        this.dropdownIndex = index;

        const buttonRect = event.target.getBoundingClientRect();
        const dropdownHeight = 80;
        const spaceBelow = window.innerHeight - buttonRect.bottom;

        this.dropdownStyle = {
          position: 'fixed',
          top:
            spaceBelow > dropdownHeight
              ? `${buttonRect.bottom + window.scrollY}px`
              : `${buttonRect.top + window.scrollY - dropdownHeight}px`,
          left: `${buttonRect.left}px`,
          zIndex: 10,
        };
      }
    },
    showDeleteModal(customer) {
      this.selectedCustomer = customer
      this.showDeleteModalFlag = true
    },
    hideDeleteModal() {
      this.showDeleteModalFlag = false
      this.selectedCustomer = null
    },
    async confirmDelete() {
      if (!this.selectedCustomer || !this.selectedCustomer.customerId) {
        console.warn('선택된 고객사가 없습니다.')
        return
      }

      try {
        await apiService.deleteCustomer(this.selectedCustomer.customerId)
        await this.fetchCustomers()
        if (this.selectedCustomer) {
          alert(
            `${this.selectedCustomer.customerName} 고객사가 삭제되었습니다.`
          )
        }
      } catch (error) {
        console.error('고객사를 삭제하는 중 오류 발생:', error)
        alert('삭제 중 오류가 발생했습니다.')
      } finally {
        this.hideDeleteModal()
        this.selectedCustomer = null
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1
      }
    },
    setPage(page) {
      this.currentPage = page
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
  justify-content: space-between;
  margin-bottom: 20px;
}
.header input[type='text'] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
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
