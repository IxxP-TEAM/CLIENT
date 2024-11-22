<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>담당자 선택</h2>
      <input v-model="searchTerm" @input="filterUsers" placeholder="담당자 검색" class="search-bar" />
      <table class="user-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>부서</th>
            <th>이메일</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in paginatedUsers"
            :key="user.userIdx"
            @click="selectUser(user)"
            :class="{ selected: selectedUser && selectedUser.userIdx === user.userIdx }"
          >
            <td>{{ user.name }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button type="button" @click="previousPage" :disabled="currentPage === 0">이전</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button type="button" @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
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
      selectedUser: null,
      searchTerm: '',
      users: [],
      filteredUsers: [],
      currentPage: 0,
      pageSize: 5,
    };
  },
  computed: {
    paginatedUsers() {
      const start = this.currentPage * this.pageSize;
      return this.filteredUsers.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize);
    },
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await apiService.fetchUserList();
        console.log('API Response:', response.data);

        if (response.data && response.data.data && response.data.data.items) {
          this.users = response.data.data.items;
          this.filteredUsers = this.users;
        } else {
          console.error('API 응답에 직원 목록이 없습니다.');
        }
      } catch (error) {
        console.error('직원 목록을 불러오는 중 오류 발생:', error);
      }
    },
    filterUsers() {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
      this.currentPage = 0; // 검색 시 첫 페이지로 이동
    },
    selectUser(user) {
      this.selectedUser = user; // 클릭한 유저를 선택
    },
    confirmSelection() {
      if (this.selectedUser) {
        this.$emit('user-selected', this.selectedUser);
        this.close();
      }
    },
    close() {
      this.$emit('close');
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
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
  background: rgba(0, 0, 0, 0.6); /* 배경 투명도 조정 */
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
  color: #2c3e50;
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
  transition: box-shadow 0.3s ease;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(63, 114, 175, 0.5); /* 포커스 효과 */
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.user-table th,
.user-table td {
  padding: 14px 16px;
  border: 1px solid #eee; /* 부드러운 테두리 */
  text-align: left; /* 좌측 정렬 */
  font-size: 1em;
}

.user-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.user-table td {
  text-align: center;
}

.user-table tr:hover {
  background-color: #f1f5f9; /* 행 호버 효과 */
  cursor: pointer;
}

.user-table tr.selected {
  background-color: #e8f0fe; /* 선택된 행 강조 */
  border: 1px solid #3f72af;
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
  background-color: #4caf50; /* 초록색 강조 */
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
  transform: scale(1.05); /* 호버 시 크기 증가 */
}

.cancel-btn {
  background-color: #e74c3c; /* 빨간색 경고 */
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
