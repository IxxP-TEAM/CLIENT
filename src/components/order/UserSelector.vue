<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <h2>담당자 선택</h2>
        <input v-model="searchTerm" @input="filterUsers" placeholder="담당자 검색" class="search-bar" />
        <table class="user-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>이름</th>
              <th>부서</th>
              <th>이메일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.userIdx">
              <td><input type="radio" :value="user" v-model="selectedUser" /></td>
              <td>{{ user.name }}</td>
              <td>{{ user.department }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </table>
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
      };
    },
    async mounted() {
      await this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await apiService.fetchUserList();
          console.log('API Response:', response.data);
  
          // 응답 데이터 구조에 맞게 직원 목록을 할당하고 필터 초기화
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
  
  .user-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .user-table th, .user-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .user-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  .user-table tr:hover {
    background-color: #f9f9f9;
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
  