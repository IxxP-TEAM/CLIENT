<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>고객사 선택</h2>
      <input v-model="searchTerm" @input="filterCustomers" placeholder="고객사 검색" class="search-bar" />
      <table class="customer-table">
        <thead>
          <tr>
            <th>고객사 이름</th>
            <th>주소</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="customer in filteredCustomers"
            :key="customer.customerId"
            @click="selectCustomer(customer)"
            :class="{ selected: selectedCustomer && selectedCustomer.customerId === customer.customerId }"
          >
            <td>{{ customer.customerName }}</td>
            <td>{{ customer.customerAddress }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="fetchCustomers(currentPage - 1)" :disabled="currentPage === 0">이전</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button @click="fetchCustomers(currentPage + 1)" :disabled="currentPage >= totalPages - 1">다음</button>
      </div>
      <div class="button-group">
        <button @click="confirmSelection" class="confirm-btn">선택 완료</button>
        <button @click="close" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService';

export default {
  data() {
    return {
      selectedCustomer: null,
      searchTerm: '',
      customers: [],
      filteredCustomers: [],
      currentPage: 0,
      totalPages: 1,
    };
  },
  async mounted() {
    await this.fetchCustomers();
  },
  methods: {
    async fetchCustomers(page = 0) {
      try {
        const response = await apiService.fetchCustomerList(page, 5); // 페이지 크기를 5로 설정
        console.log('API Response:', response.data.content); // 데이터 확인용

        if (response.data && response.data.content) {
          this.customers = response.data.content;
          this.filteredCustomers = this.customers;
          this.totalPages = response.data.totalPages;
          this.currentPage = page;
        } else {
          console.error('API 응답에 고객사 목록이 없습니다.');
        }
      } catch (error) {
        console.error('고객사 목록을 불러오는 중 오류 발생:', error);
      }
    },
    filterCustomers() {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        (customer.customerName && customer.customerName.toLowerCase().includes(term)) ||
        (customer.customerAddress && customer.customerAddress.toLowerCase().includes(term))
      );
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer;
    },
    confirmSelection() {
      if (this.selectedCustomer) {
        this.$emit('customer-selected', this.selectedCustomer);
        this.close();
      }
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #3f72af;
}

.search-bar {
  padding: 10px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  box-sizing: border-box;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.customer-table th, .customer-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.customer-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.customer-table tr:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}

.customer-table tr.selected {
  background-color: #cce5ff; /* 선택된 행 색상 */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn {
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
}

.confirm-btn:hover {
  background-color: #2c5987;
}

.cancel-btn {
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c9302c;
}
</style>
