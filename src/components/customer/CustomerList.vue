<template>
    <div class="customer-list">
      <h2>고객사 목록</h2>
      <div class="header">
        <input type="text" v-model="searchQuery" placeholder="검색" @input="handleSearch" />
        <button @click="registerCustomer">고객사 등록</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>고객사명</th>
              <th>고객사 번호</th>
              <th>고객사 담당자</th>
              <th>고객사 담당자 연락처</th>
              <th>고객사 주소</th>
              <th>고객사 거래상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in paginatedCustomers" :key="customer.customerId">
              <td>{{ customer.customerName }}</td>
              <td>{{ customer.customerPhone }}</td>
              <td>{{ customer.customerPersonName }}</td>
              <td>{{ customer.customerPersonPhone }}</td>
              <td>{{ customer.customerAddress }}</td>
              <td>{{ customer.customerStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
        <span v-for="page in totalPages" :key="page" @click="setPage(page)" :class="{ active: currentPage === page }">
          {{ page }}
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        customers: [
          { customerId: 1, customerName: '예시 고객사', customerPhone: '02-1234-5678', customerPersonName: '홍길동', customerPersonPhone: '010-1234-5678', customerAddress: '서울시 중구 예시로 1', customerStatus: '활성' },
          { customerId: 2, customerName: 'aa', customerPhone: '02-1234-5678', customerPersonName: '홍길동', customerPersonPhone: '010-1234-5678', customerAddress: '서울시 중구 예시로 1', customerStatus: '활성' },
        ],
        searchQuery: '',
        currentPage: 1,
        pageSize: 10,
      };
    },
    computed: {
      filteredCustomers() {
        if (!this.searchQuery) {
          return this.customers;
        }
        return this.customers.filter(customer =>
          customer.customerName.includes(this.searchQuery) ||
          customer.customerPersonName.includes(this.searchQuery)
        );
      },
      totalPages() {
        return Math.ceil(this.filteredCustomers.length / this.pageSize);
      },
      paginatedCustomers() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredCustomers.slice(start, end);
      },
    },
    methods: {
      handleSearch() {
        this.currentPage = 1;
      },
      registerCustomer() {
        alert('고객사 등록 페이지로 이동');
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage -= 1;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage += 1;
        }
      },
      setPage(page) {
        this.currentPage = page;
      },
    },
  };
  </script>
  
  <style scoped>
  .customer-list {
    padding: 100px;
    width: max-content;
    margin-left: 100px;
    height: calc(100vh - 50px); /* Adjusts height to take up viewport height minus header */
    overflow: auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .header input[type="text"] {
    padding: 8px;
    font-size: 16px;
    width: 300px;
  }
  
  .header button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #3F72AF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .table-container {
    overflow-x: auto; /* Allows horizontal scrolling if content overflows */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap; /* Prevents text wrapping within cells */
  }
  
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .pagination {
    text-align: center;
  }
  
  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 14px;
  }
  
  .pagination span {
    margin: 0 5px;
    cursor: pointer;
  }
  
  .pagination .active {
    font-weight: bold;
    color: #3F72AF;
  }
  </style>
  