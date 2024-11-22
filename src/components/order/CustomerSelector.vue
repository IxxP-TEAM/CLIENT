<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>고객사 선택</h2>
      <input
        v-model="searchTerm"
        @input="filterCustomers"
        placeholder="고객사 검색"
        class="search-bar"
      />
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
            :class="{
              selected:
                selectedCustomer &&
                selectedCustomer.customerId === customer.customerId,
            }"
          >
            <td>{{ customer.customerName }}</td>
            <td>{{ customer.customerAddress }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button
          type="button"
          @click="fetchCustomers(currentPage - 1)"
          :disabled="currentPage === 0"
        >
          이전
        </button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button
          type="button"
          @click="fetchCustomers(currentPage + 1)"
          :disabled="currentPage >= totalPages - 1"
        >
          다음
        </button>
      </div>
      <div class="button-group">
        <button @click="confirmSelection" class="confirm-btn">선택 완료</button>
        <button @click="close" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService'

export default {
  data() {
    return {
      selectedCustomer: null,
      searchTerm: '',
      customers: [],
      filteredCustomers: [],
      currentPage: 0,
      totalPages: 1,
    }
  },
  async mounted() {
    await this.fetchCustomers()
  },
  methods: {
    async fetchCustomers(page = 0) {
      try {
        const response = await apiService.fetchCustomerList(page, 5) // 페이지 크기를 5로 설정
        console.log('API Response:', response.data.content) // 데이터 확인용

        if (response.data && response.data.content) {
          this.customers = response.data.content
          this.filteredCustomers = this.customers
          this.totalPages = response.data.totalPages
          this.currentPage = page
        } else {
          console.error('API 응답에 고객사 목록이 없습니다.')
        }
      } catch (error) {
        console.error('고객사 목록을 불러오는 중 오류 발생:', error)
      }
    },
    filterCustomers() {
      const term = this.searchTerm.toLowerCase()
      this.filteredCustomers = this.customers.filter(
        customer =>
          (customer.customerName &&
            customer.customerName.toLowerCase().includes(term)) ||
          (customer.customerAddress &&
            customer.customerAddress.toLowerCase().includes(term))
      )
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer
    },
    confirmSelection() {
      if (this.selectedCustomer) {
        this.$emit('customer-selected', this.selectedCustomer)
        this.close()
      }
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* 배경 투명도를 조금 더 진하게 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease; /* 페이드 인 애니메이션 */
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 700px; /* 더 넓은 너비 */
  max-width: 90%;
  max-height: 85vh; /* 최대 높이 제한 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease; /* 슬라이드 인 애니메이션 */
  -ms-overflow-style: none; /* IE 및 Edge 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox 스크롤바 숨김 */
}

.modal-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari 스크롤바 숨김 */
}

h2 {
  font-size: 1.8em;
  margin-bottom: 20px;
  color: #2c3e50; /* 제목 색상 변경 */
  text-align: center; /* 중앙 정렬 */
  font-weight: bold;
}

.search-bar {
  padding: 12px;
  margin-bottom: 15px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(63, 114, 175, 0.5); /* 포커스 효과 */
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.customer-table th,
.customer-table td {
  padding: 14px 16px;
  border: 1px solid #eee; /* 테두리 색상 변경 */
  text-align: left; /* 좌측 정렬 */
  font-size: 1em;
}

.customer-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.customer-table tr:hover {
  background-color: #f1f5f9; /* 행 호버 색상 */
  cursor: pointer;
}

.customer-table tr.selected {
  background-color: #e8f0fe; /* 선택된 행 색상 */
  border: 1px solid #2c5987;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 15px 0;
}

.pagination button {
  background-color: #3f72af;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #dcdcdc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #2c5987;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.confirm-btn {
  background-color: #4caf50; /* 성공 색상 */
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 25px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.confirm-btn:hover {
  background-color: #43a047;
  transform: scale(1.05); /* 호버 시 확대 */
}

.cancel-btn {
  background-color: #e74c3c; /* 경고 색상 */
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 25px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cancel-btn:hover {
  background-color: #c0392b;
  transform: scale(1.05);
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.6);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
