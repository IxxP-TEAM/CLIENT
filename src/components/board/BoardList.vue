<template>
  <div class="board-list">
    <h2>게시글 목록</h2>

    <!-- 검색 및 필터 아이콘 -->
    <div class="header">
      <div class="search-filter-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="검색"
          @input="handleSearch"
          class="search-input"
        />
        <button @click="toggleFilters" class="jump-button">
          <i class="fas fa-sliders-h"></i>
        </button>
      </div>

      <!-- 게시글 등록 버튼 -->
      <button @click="openForm(false)" class="jump-button">게시글 등록</button>
    </div>

    <!-- 필터 섹션 -->
    <div v-if="showFilters" class="filters">
      <!-- 제목 정렬 -->
      <div class="filter-group">
        <select
          id="titleSortOrder"
          v-model="titleSortOrder"
          @change="applyFilters"
          class="filter-select"
        >
          <option>제목</option>
          <option value="asc">제목⬆️</option>
          <option value="desc">제목⬇️</option>
        </select>
      </div>

      <!-- 조회수 정렬 -->
      <div class="filter-group">
        <select
          id="viewCountSortOrder"
          v-model="viewCountSortOrder"
          @change="applyFilters"
          class="filter-select"
        >
          <option>조회수</option>
          <option value="asc">조회수⬆️</option>
          <option value="desc">조회수⬇️</option>
        </select>
      </div>

      <!-- 작성자 정렬 -->
      <div class="filter-group">
        <select
          id="writerSortOrder"
          v-model="writerSortOrder"
          @change="applyFilters"
          class="filter-select"
        >
          <option>작성자</option>
          <option value="asc">작성자⬆️</option>
          <option value="desc">작성자⬇️</option>
        </select>
      </div>
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
          <tr v-if="boards.length === 0">
            <td colspan="5">게시글이 없습니다.</td>
          </tr>

          <!-- 데이터가 있을 경우 -->
          <tr
            v-for="(board, index) in boards"
            :key="board.boardId"
            class="clickable-row"
            @click="viewBoardDetail(board.boardId)"
          >
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
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
      sortOrder: 'desc', // 기본값: 내림차순 (최신순)
      writerFilter: '', // 작성자 필터
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      showFilters: false, // 필터 섹션 숨기기 기본값
      showForm: false,
      selectedBoard: null,
      isEditMode: false,
      titleSortOrder: '제목', // 빈 문자열 -> 초기값 필요
      viewCountSortOrder: '조회수', // 빈 문자열 -> 초기값 필요
      writerSortOrder: '작성자', // 빈 문자열 -> 초기값 필요
      createdAtSortOrder: 'desc', // 최신순 기본값
    }
  },

  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters // 필터 섹션 표시/숨기기
    },
    async fetchBoards() {
      try {
        const response = await apiService.fetchBoardListByType(
          this.type,
          this.currentPage - 1, // 서버는 0부터 시작
          this.pageSize,
          this.searchQuery,
          this.sortOrder
        )

        const data = response.data.data
        this.boards = data.content || []
        this.totalPages = data.totalPages || 1
        this.currentPage = data.number + 1

        // 기본값: 최신순 정렬
        this.boards.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error)
        this.boards = []
        this.totalPages = 1
      }
    },
    applyFilters() {
      // 제목 정렬
      if (this.titleSortOrder !== '제목') {
        this.boards.sort((a, b) => {
          return this.titleSortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        })
      }

      // 조회수 정렬
      if (this.viewCountSortOrder !== '조회수') {
        this.boards.sort((a, b) => {
          return this.viewCountSortOrder === 'asc'
            ? a.viewCount - b.viewCount
            : b.viewCount - a.viewCount
        })
      }

      // 작성자 정렬
      if (this.writerSortOrder !== '작성자') {
        this.boards.sort((a, b) => {
          return this.writerSortOrder === 'asc'
            ? a.writerName.localeCompare(b.writerName)
            : b.writerName.localeCompare(a.writerName)
        })
      }
    },
    handleSearch() {
      this.currentPage = 1 // 검색 시 첫 페이지로 이동
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
    applySearch() {
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        this.boards = this.boards.filter(board =>
          board.title.toLowerCase().includes(query)
        )
      }
    },
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchBoards()
      }
    },
    async viewBoardDetail(boardId) {
      try {
        // 조회수 증가 API 호출
        await apiService.incrementViewCount(boardId)
        // 게시글 상세 페이지로 이동
        this.$router.push({ name: 'BoardDetail', params: { id: boardId } })
      } catch (error) {
        console.error('조회수 증가 실패:', error)
      }
    },
    openForm(isEdit = false) {
      this.isEditMode = isEdit
      this.showForm = true
      this.selectedBoard = isEdit ? this.selectedBoard : {}
    },
    closeForm() {
      this.showForm = false
      this.selectedBoard = null
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
  },
  mounted() {
    this.fetchBoards()
  },
  watch: {
    type(newType) {// eslint-disable-line no-unused-vars
      
      this.fetchBoards()
    },
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
}

.header input[type='text'] {
  padding: 8px;
  font-size: 16px;
  width: 300px;
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

.table-container {
  overflow-x: auto;
}
.table-container::-webkit-scrollbar {
  display: none;
}
.table-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
}
.ellipsis {
  display: inline-block;
  max-width: 200px; 
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
th {
  background-color: #f4f4f4;
  font-weight: bold;
}
.action-cell {
  position: relative;
}
.dropdown-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.dropdown-menu {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100px;
  z-index: 10;
}
.dropdown-menu button {
  background: none;
  border: none;
  padding: 5px;
  text-align: left;
  cursor: pointer;
}
.dropdown-menu button:hover {
  background-color: #f0f0f0;
}


.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 5px; 
}

.pagination-page {
  font-size: 16px;
  font-weight: bold;
  color: black; 
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.pagination-page:hover {
  color: #434190; 
  transform: scale(1.1); 
}

.pagination-page.active {
  color: #3f72af; 
  font-size: 18px; 
  text-decoration: underline;
}

.pagination-arrow {
  font-size: 18px;
  font-weight: bold;
  color: #3f72af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.pagination-arrow:hover {
  color: #434190; 
  transform: translateY(-2px); 
}

.pagination-arrow:disabled {
  color: #b0b0b0; 
  cursor: not-allowed;
  transform: none;
}

.search-filter-container {
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
  outline: none; 
  transition: box-shadow 0.3s ease; 
}

.search-input:focus {
  border-color: #3f72af; 
  box-shadow: 0 0 5px rgba(63, 114, 175, 0.5); 
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

.register-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.filters {
  display: flex;
  align-items: center;
  gap: 20px; 
  padding: 10px;
  background-color: #f9f9f9; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  margin-bottom: 20px; 
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-size: 14px;
  font-weight: bold;
  color: #333; 
}

.filter-select {
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-select:focus {
  border-color: #3f72af;
  box-shadow: 0 0 4px rgba(63, 114, 175, 0.5);
  outline: none;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #f4f4f4;
}

.jump-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #3f72af;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}

.status {
  color: #fff;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 10px;
  display: inline;
  text-align: center;
}

.status.active {
  background-color: #4caf50; 
}

.status.inactive {
  background-color: #f44336; 
}
</style>
