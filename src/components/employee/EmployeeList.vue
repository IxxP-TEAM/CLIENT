<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <div class="user-list">
      <h2>직원 목록</h2>
      <div class="header">
        <input type="text" v-model="searchQuery" placeholder="이름으로 검색" @input="handleSearch" />

        <div class="filter-options">
          <select v-model="selectedDepartment" @change="handleDepartmentChange">
            <option value="">전체 부서</option>
            <option v-for="department in departments" :key="department" :value="department">{{ department }}</option>
          </select>
        </div>
        <button @click="openModal">직원 등록</button>

        <employee-modal :isVisible="isModalVisible" :closeModal="closeModal" />
        <employee-detail-modal v-if="isDetailModalVisible" :isVisible="isDetailModalVisible"
          :closeModal="closeDetailModal" :user="selectedUser" />
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>부서</th>
              <th>직위</th>
              <th>연락처</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.userIdx" @click="fetchUserDetails(user.userIdx)">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.department }}</td>
              <td>{{ user.jobTitle }}</td>
              <td>{{ user.userPhone }}</td>
              <td>{{ user.userStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button class="pagination-arrow" :disabled="currentPage === 0" @click="handlePageChange(currentPage - 1)">
          < </button>
            <span v-for="page in totalPages" :key="page" :class="{
              'pagination-page': true,
              'active': page === currentPage + 1
            }" @click="handlePageChange(page - 1)">
              {{ page }}
            </span>

            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage >= totalPages - 1"
              class="pagination-arrow">
              > </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js';
import EmployeeModal from '../employee/EmployeeModal.vue';
import EmployeeDetailModal from '../employee/EmployeeDetailModal.vue'
import apiService from '@/api/apiService';

export default {
  components: {
    EmployeeModal,
    EmployeeDetailModal,
  },
  data() {
    return {
      isModalVisible: false,
      isDetailModalVisible: false,
      users: [],
      searchQuery: '',
      selectedDepartment: '',
      departments: ['영업1팀', '영업2팀', '영업3팀', '인사1팀', '인사2팀', '인사3팀', '생산1팀', '생산2팀', '생산3팀'],
      selectedUser: {},
      currentPage: 0,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0,
    };
  },
  computed: {
    filteredUsers() {
      let result = this.users;

      if (this.searchQuery) {
        result = result.filter(user =>
          user.name.includes(this.searchQuery)
        );
      }

      if (this.selectedDepartment) {
        result = result.filter(user =>
          user.department === this.selectedDepartment
        );
      }
      return result;
    },
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    closeDetailModal() {
      this.isDetailModalVisible = false;
      this.selectedUser = {};
    },
    async fetchUsers() {
      try {
        const response = await apiService.fetchUserList(
          this.currentPage,
          this.pageSize,
        );
        this.users = [...response.data.data.items];
        this.totalElements = response.data.data.totalElements;
        this.totalPages = response.data.data.totalPages;
      } catch (error) {
        console.error("직원 목록을 가져오는 데 오류가 발생했습니다.", error);
      }
    },
    handlePageChange(page) {
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
        this.fetchUsers();
      }
    },
    async fetchUserDetails(userIdx) {
      try {
        const response = await api.get(`/hr/${userIdx}`);
        this.selectedUser = response.data.data;
        this.isDetailModalVisible = true;
      } catch (error) {
        console.error("직원 상세 정보를 가져오는 데 오류가 발생했습니다.", error);
      }
    },
    handleSearch() {
      this.currentPage = 0;
    },
    handleDepartmentChange() {
      this.currentPage = 0;
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.user-list {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow: auto;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  gap: 13px;
}

.header input[type="text"] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
}

.filter-options {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header select {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #333;
}

.header button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3F72AF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: auto;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination span.current-page {
  font-weight: bold;
  text-decoration: underline;
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