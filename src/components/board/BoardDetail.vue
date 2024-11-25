<template>
  <div class="board-detail">
    <!-- 제목 영역 -->
    <div class="board-header">
      <h2>{{ board.title || '제목 없음' }}</h2>
    </div>

    <!-- 작성자 및 기타 정보 -->
    <div class="board-info">
      <div class="info-row">
        <span
          ><strong>작성자:</strong>
          {{ board.writerName || '작성자 없음' }}</span
        >
        <span
          ><strong>작성일:</strong>
          {{ formatDate(board.createdAt) || '작성일 없음' }}</span
        >
      </div>
    </div>

    <!-- 내용 영역 -->
    <div class="board-content">
      <div
        class="quill-content"
        v-html="board.content || '<p>내용이 없습니다.</p>'"
      ></div>

      <!-- 옵션 메뉴 -->
      <div class="dropdown-container" v-if="isOwner">
        <button class="menu-button" @click="toggleMenu">⋯</button>
        <div class="dropdown-menu" v-if="isMenuOpen">
          <button class="dropdown-item" @click="openEditModal">수정하기</button>
          <button class="dropdown-item danger" @click="openDeleteConfirm">
            삭제하기
          </button>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div class="delete-confirm-modal" v-if="isDeleteConfirmOpen">
      <div class="modal-content">
        <p>정말로 이 게시글을 삭제하시겠습니까?</p>
        <div class="modal-buttons">
          <button class="btn-danger" @click="deleteBoard">삭제</button>
          <button class="btn-cancel" @click="closeDeleteConfirm">취소</button>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <board-form
      v-if="isEditModalOpen"
      :is-edit-mode="true"
      :board-data="board"
      @saved="onEditSaved"
      @close="closeEditModal"
    />
  </div>
</template>

<script>
import apiService from '@/api/apiService'
import BoardForm from '@/components/board/BoardForm.vue'

export default {
  props: ['id'],
  components: {
    BoardForm,
  },
  data() {
    return {
      board: {}, // 게시글 데이터 저장
      isEditModalOpen: false, // 수정 모달 상태
      userId: null, // 로그인한 유저 ID
      isMenuOpen: false, // 드롭다운 메뉴 상태
      isDeleteConfirmOpen: false, // 삭제 확인 모달 상태
    }
  },
  computed: {
    // 로그인한 유저가 작성자인지 확인
    isOwner() {
      return this.userId && this.board.writerConnId === this.userId
    },
  },
  methods: {
    // 게시글 데이터 가져오기
    async fetchBoardDetail() {
      try {
        const response = await apiService.getBoardDetail(this.id)
        this.board = response.data.data
      } catch (error) {
        console.error('게시글 상세 정보 조회 실패:', error.message)
      }
    },
    parseJwt(token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        return JSON.parse(jsonPayload)
      } catch (error) {
        console.error('토큰 디코딩 실패:', error.message)
        return null
      }
    },
    // JWT 토큰에서 유저 ID 추출
    extractUserIdFromToken() {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.warn('로그인 토큰이 없습니다.')
        return
      }
      const decoded = this.parseJwt(token)
      if (decoded && decoded.username) {
        this.userId = decoded.username
      } else {
        console.error('유효하지 않은 토큰입니다.')
      }
    },
    // 드롭다운 메뉴 동작
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    },
    handleClickOutside(event) {
      const menu = this.$el.querySelector('.dropdown-menu')
      if (
        menu &&
        !menu.contains(event.target) &&
        !event.target.matches('.menu-button')
      ) {
        this.closeMenu()
      }
    },
    // 삭제 확인 모달 열기
    openDeleteConfirm() {
      this.isDeleteConfirmOpen = true
      this.closeMenu() // 메뉴 닫기
    },
    // 삭제 확인 모달 닫기
    closeDeleteConfirm() {
      this.isDeleteConfirmOpen = false
    },
    // 날짜 포맷팅
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    // 수정 모달 열기
    openEditModal() {
      this.isEditModalOpen = true
    },
    // 수정 모달 닫기
    closeEditModal() {
      this.isEditModalOpen = false
    },
    // 수정 저장 후 처리
    onEditSaved(updatedBoard) {
      this.board = updatedBoard
      this.closeEditModal()
    },
    // 게시글 삭제
    async deleteBoard() {
      try {
        await apiService.deleteBoard(this.id)
        this.$router.push('/board-list/NOTICE') // 게시판 목록으로 이동
      } catch (error) {
        console.error('게시글 삭제 실패:', error.message)
        alert('게시글 삭제 중 문제가 발생했습니다.')
      }
    },
  },
  mounted() {
    this.extractUserIdFromToken()
    this.fetchBoardDetail()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style scoped>
@import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';

.board-detail {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: scroll;
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

.board-detail::-webkit-scrollbar {
  display: none; 
}

.board-header h2 {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.board-info {
  margin-bottom: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 10px 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #555;
}

.board-content {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
  line-height: 1.6;
  position: relative;
}

.quill-content {
  font-size: 16px;
  color: #333;
}

.dropdown-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

.menu-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #555;
  transition: color 0.3s ease;
}

.menu-button:hover {
  color: #333;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 10;
  min-width: 150px; 
}

.dropdown-item {
  display: flex;
  align-items: center; 
  justify-content: center; 
  width: 100%; 
  text-align: center; 
  padding: 12px 20px; 
  font-size: 16px; 
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-item.danger {
  color: #ff5a5f;
  font-weight: bold; 
}

.dropdown-item.danger:hover {
  background-color: #ffe6e7;
}

.delete-confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease; 
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease; 
}

.modal-content p {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px; 
}

.btn-danger {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 12px 25px; 
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-danger:hover {
  background-color: #e04343;
  transform: scale(1.05); 
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  padding: 12px 25px; 
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-cancel:hover {
  background-color: #d9d9d9;
  transform: scale(1.05); 
}

@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.7);
  }
}

@keyframes slideUp {
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