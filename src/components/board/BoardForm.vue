<template>
    <div class="modal-overlay" @click.self="cancel">
      <div class="modal-content">
        <h2>{{ isEditMode ? '게시글 수정' : '게시글 작성' }}</h2>
        <div class="grid-item">
          <label for="type">게시판 타입</label>
          <select v-model="board.type" id="type" required>
            <option value="NOTICE">공지사항</option>
            <option value="FREE">자유게시판</option>
            <option value="ANONYMOUS">익명게시판</option>
          </select>
        </div>
        <form @submit.prevent="submitBoard" class="grid-form">
          <div class="grid-item">
            <label for="title">제목</label>
            <input v-model="board.title" id="title" type="text" required />
          </div>
          <div class="grid-item full-width">
            <label for="content">내용</label>
            <textarea v-model="board.content" id="content" rows="4" required></textarea>
          </div>
          <!-- 공지 여부는 ADMIN 사용자만 보이도록 처리 -->
          <div class="grid-item" v-if="userRole && userRole === 'ADMIN'">
            <label for="isPinned">공지 여부</label>
            <input type="checkbox" v-model="board.isPinned" id="isPinned" />
          </div>
          <!-- 버튼 그룹 -->
          <div class="button-group">
            <button type="submit">{{ isEditMode ? '수정' : '작성' }}</button>
            <button type="button" @click="cancel">취소</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import apiService from '@/api/apiService';
  import VueJwtDecode from 'vue-jwt-decode';
  
  export default {
    props: {
      isEditMode: {
        type: Boolean,
        default: false,
      },
      boardData: {
        type: Object,
        default: () => ({
          boardId: null, // 게시글 ID 추가
          title: '',
          content: '',
          type: 'FREE',
          isPinned: false,
          writerName: '', // 익명 게시글 작성시 추가
        }),
      },
    },
    data() {
      return {
        board: { ...this.boardData },
        userRole: null, // 사용자 역할 저장
      };
    },
    methods: {
      async fetchUserRole() {
        try {
          const token = localStorage.getItem('accessToken');
          if (token) {
            const decoded = VueJwtDecode.decode(token);
            this.userRole = decoded.role; // 토큰에서 role 필드 가져오기
          }
        } catch (error) {
          console.error('사용자 역할 로드 실패:', error.message);
        }
      },
      async submitBoard() {
        try {
          // 익명 게시글 작성 시 writerName 설정
          if (this.board.type === 'ANONYMOUS') {
            this.board.writerName = '익명';
          }
  
          // 게시글 수정
          if (this.isEditMode) {
            if (!this.board.boardId) {
              alert('게시글 ID가 없습니다.');
              return;
            }
            await apiService.updateBoard(this.board.boardId, this.board);
            alert('게시글이 수정되었습니다.');
          } else {
            // 게시글 작성
            await apiService.createBoard(this.board);
            alert('게시글이 작성되었습니다.');
          }
          this.$emit('saved');
        } catch (error) {
          console.error(
            '게시글 저장 실패:',
            error.response?.data?.message || error.message
          );
        }
      },
      cancel() {
        this.$emit('close');
      },
    },
    mounted() {
      this.fetchUserRole(); // 컴포넌트가 마운트될 때 사용자 역할 로드
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
    padding: 30px;
    border-radius: 8px;
    width: 800px; /* 가로 너비 */
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto; /* 스크롤 활성화 */
  }
  
  /* 스크롤바 숨김 */
  .modal-content::-webkit-scrollbar {
    display: none;
  }
  .modal-content {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  
  .grid-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .grid-item {
    display: flex;
    flex-direction: column;
  }
  
  .full-width {
    grid-column: span 2;
  }
  
  .button-group {
    grid-column: span 2;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  input,
  select,
  textarea {
    padding: 12px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button[type='submit'] {
    background-color: #3f72af;
    color: white;
    border: none;
    border-radius: 4px;
    width: 150px;
    padding: 12px;
    cursor: pointer;
  }
  
  button[type='submit']:hover {
    background-color: #2c5987;
  }
  
  button[type='button'] {
    background-color: gray;
    color: white;
    border: 2px solid gray;
    border-radius: 4px;
    width: 150px;
    padding: 12px;
    cursor: pointer;
  }
  
  button[type='button']:hover {
    background-color: rgb(80, 80, 80);
  }
  </style>
  