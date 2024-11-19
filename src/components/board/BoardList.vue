<template>
  <div class="board-list">
    <h2>게시글 목록</h2>

    <!-- 검색 및 필터 -->
    <div class="header">
      <div class="search-filter-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색"
          @input="handleSearch"
          class="search-input"
        />
        <select v-model="sortOrder" @change="fetchBoards" class="filter">
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
      <button @click="openForm(false)" class="register-button">
        게시글 등록
      </button>
    </div>

    <!-- 게시글 목록 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          <!-- 데이터가 없을 경우 -->
          <tr v-if="paginatedBoards.length === 0">
            <td colspan="6"></td>
          </tr>

          <!-- 데이터가 있을 경우 -->
          <tr
            v-for="(board, index) in paginatedBoards"
            :key="board.boardId"
            class="clickable-row"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ board.title }}</td>
            <td>{{ board.writerName }}</td>
            <td>{{ board.viewCount }}</td>
            <td>{{ formatDate(board.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-arrow"
      >
        &lt;
      </button>
      <span
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{ active: currentPage === page }"
        class="pagination-page"
      >
        {{ page }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-arrow"
      >
        &gt;
      </button>
    </div>

    <!-- 게시글 등록/수정 모달 -->
    <BoardForm
      v-if="showForm"
      :boardData="selectedBoard"
      :isEditMode="isEditMode"
      @close="closeForm"
      @saved="fetchBoards"
    />
  </div>
</template>
  
  <script>
import apiService from '@/api/apiService'
import BoardForm from './BoardForm.vue'

export default {
  components: { BoardForm },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      boards: [],
      searchQuery: '',
      sortOrder: 'asc', // 오름차순 기본값
      currentPage: 1,
      pageSize: 10,
      showForm: false,
      selectedBoard: null,
      isEditMode: false,
    }
  },
  computed: {
    boardTypeLabel() {
      switch (this.type) {
        case 'NOTICE':
          return '공지게시판'
        case 'FREE':
          return '자유게시판'
        case 'ANONYMOUS':
          return '익명게시판'
        default:
          return '게시판'
      }
    },
    filteredBoards() {
      let filtered = this.boards || []
      if (this.searchQuery) {
        filtered = filtered.filter(board =>
          board.title.includes(this.searchQuery)
        )
      }
      filtered = filtered.filter(board => board.type === this.type) // type에 맞는 데이터만 필터
      return filtered.sort((a, b) => {
        if (this.sortOrder === 'asc')
          return a.title.localeCompare(b.title, 'ko')
        return b.title.localeCompare(a.title, 'ko')
      })
    },

    totalPages() {
      return Math.ceil(this.filteredBoards.length / this.pageSize)
    },
    paginatedBoards() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredBoards.slice(start, end)
    },
  },
  watch: {
    // 'type'가 변경될 때마다 데이터 다시 불러오기
    type(newType) {
      this.fetchBoards()
    },
    searchQuery() {
      this.currentPage = 1 // 검색 시 첫 페이지로 리셋
      this.fetchBoards()
    },
  },
  methods: {
    async fetchBoards() {
      try {
        const response = await apiService.fetchBoardListByType(
          this.type,
          this.currentPage - 1,
          this.pageSize,
          this.searchQuery,
          this.sortOrder
        )
        this.boards = response.data.data.content || [] // 데이터 content 할당
      } catch (error) {
        console.error('게시글 목록을 불러오는 중 오류 발생:', error)
        this.boards = []
      }
    },
    handleSearch() {
      this.currentPage = 1 // 검색 시 첫 페이지로 리셋
      this.fetchBoards()
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchBoards()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchBoards()
      }
    },
    setPage(page) {
      this.currentPage = page
      this.fetchBoards()
    },
    openForm(isEdit = false) {
      this.isEditMode = isEdit
      this.showForm = true
      this.selectedBoard = isEdit ? this.selectedBoard : {}
    },
    openEditForm(board) {
      this.selectedBoard = board
      this.isEditMode = true
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
      this.selectedBoard = null
    },
    confirmDelete(board) {
      if (confirm(`정말로 "${board.title}" 게시글을 삭제하시겠습니까?`)) {
        this.deleteBoard(board.boardId)
      }
    },
    async deleteBoard(boardId) {
      try {
        await apiService.deleteBoard(boardId)
        this.fetchBoards()
      } catch (error) {
        console.error('게시글 삭제 실패:', error)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
  },
  mounted() {
    this.fetchBoards()
  },
  beforeRouteUpdate(to, from, next) {
    // 라우터 변경 시 데이터 새로 고침
    this.fetchBoards()
    next()
  },
}
</script>
  
  <style scoped>
.board-list {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto;
}

/* 스크롤바 숨기기 */
.board-list::-webkit-scrollbar {
  display: none;
}
.board-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.header input[type='text'] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.right-controls {
  display: flex;
  gap: 10px;
}

.right-controls select.filter {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

/* 필터 토글 버튼 스타일 */
.filter-toggle {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

/* 검색 및 필터 아이콘 스타일 */
.search-filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-filter-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 8px;
  font-size: 16px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filter-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.filter-icon-button .fas {
  color: #4caf50;
}

/* 필터 섹션 스타일 */
.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 8px;
}

.register-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 테이블 스타일 */
.table-container {
  overflow-x: auto;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table-container th,
.table-container td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.table-container th {
  background-color: #f4f4f4;
  font-weight: bold;
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
