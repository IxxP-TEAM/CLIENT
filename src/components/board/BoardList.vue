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
      sortOrder: 'asc', // 기본값: 오름차순
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      showForm: false,
      selectedBoard: null,
      isEditMode: false,
    }
  },
  methods: {
    async fetchBoards() {
      try {
        const response = await apiService.fetchBoardListByType(
          this.type,
          this.currentPage - 1, // 서버는 0부터 시작
          this.pageSize,
          this.searchQuery,
          this.sortOrder
        )

        // API 응답 데이터 처리
        const data = response.data.data
        this.boards = data.content || []
        this.totalPages = data.totalPages || 1
        this.currentPage = data.number + 1 // API는 0부터 시작하므로 +1
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error)
        this.boards = []
        this.totalPages = 1
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
    type(newType) {
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
  border-collapse: collapse; /* 테두리 병합 */
  margin-bottom: 20px;
}

.table-container th,
.table-container td {
  padding: 12px;
  text-align: left;
}

.table-container th {
  background-color: #f4f4f4;
  font-weight: bold;
}

/* 각 행의 아래쪽에만 줄 표시 */
.table-container tr {
  border-bottom: 1px solid #ddd;
}

.table-container tr:last-child {
  border-bottom: 1px solid #ddd;
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
.clickable-row {
  cursor: pointer; /* 마우스 커서를 손 모양으로 변경 */
  transition: background-color 0.3s ease; /* 배경색 변경에 부드러운 전환 효과 추가 */
}

.clickable-row:hover {
  background-color: #f4f4f4; /* 마우스 hover 시 배경 색상 */
}
</style>