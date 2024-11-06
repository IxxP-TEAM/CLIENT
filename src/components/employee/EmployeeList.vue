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

        <button @click="openModal">직원 등록</button>
        </div>

        <employee-modal
          :isVisible="isModalVisible"
          :closeModal="closeModal"
        />
        <employee-detail-modal
          v-if="isDetailModalVisible"
          :isVisible="isDetailModalVisible"
          :closeModal="closeDetailModal"
          :user="selectedUser"
        />
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
            <tr v-for="user in paginatedUsers" :key="user.userIdx" @click="fetchUserDetails(user.userIdx)">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.department }}</td>
              <td>{{ user.jobtitle }}</td>
              <td>{{ user.userPhone }}</td>
              <td>{{ user.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 0">&lt;</button>
        <span v-for="page in totalPages" :key="page" @click="setPage(page - 1)" :class="{ active: currentPage === page - 1 }">
          {{ page }}
        </span>
        <button @click="nextPage" :disabled="currentPage >= totalPages - 1">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api.js';
import EmployeeModal from '../employee/EmployeeModal.vue';
import EmployeeDetailModal from '../employee/EmployeeDetailModal.vue'

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
    paginatedUsers() {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredUsers.slice(start, end);
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
        const response = await api.get('/hr');
        const result = response.data;
        this.users = result.data.items;
        this.totalElements = result.data.totalElements;
        this.totalPages = result.data.totalPages;
      } catch (error) {
        console.error("직원 목록을 가져오는 데 오류가 발생했습니다.", error);
      }
    },
    async fetchUserDetails(userIdx) {
      try {
        const response = await api.get(`/hr/${userIdx}`);
        this.selectedUser = response.data.data;
        this.isDetailModalVisible = true;
        console.log("userdetail" , response);
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
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage += 1;
      }
    },
    setPage(page) {
      this.currentPage = page;
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.header select option[value=""] {
  color: #999;
  font-weight: bold;
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
  overflow-x: auto;
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
  white-space: nowrap;
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