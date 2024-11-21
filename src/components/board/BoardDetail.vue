<template>
  <div class="board-detail">
    <h2>{{ board.title || "제목 없음" }}</h2>
    <div class="board-info">
      <p><strong>작성자:</strong> {{ board.writerName || "작성자 없음" }}</p>
      <p><strong>작성일:</strong> {{ formatDate(board.createdAt) || "작성일 없음" }}</p>
    </div>
    <div class="board-content">
      <h3>내용:</h3>
      <div
        class="quill-content"
        v-html="board.content || '<p>내용이 없습니다.</p>'"
      ></div>
    </div>
    <div class="button-group">
      <button @click="openEditModal">수정하기</button>
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
import apiService from "@/api/apiService";
import BoardForm from "@/components/board/BoardForm.vue"; 

export default {
  props: ["id"],
  components: {
    BoardForm,
  },
  data() {
    return {
      board: {}, // 게시글 데이터 저장
      isEditModalOpen: false, // 수정 모달 상태
    };
  },
  methods: {
    // 게시글 데이터 가져오기
    async fetchBoardDetail() {
      try {
        const response = await apiService.getBoardDetail(this.id); // API 호출
        this.board = response.data.data;
      } catch (error) {
        console.error("게시글 상세 정보 조회 실패:", error.message);
      }
    },
    // 날짜 포맷팅
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    // 수정 모달 열기
    openEditModal() {
      this.isEditModalOpen = true;
    },
    // 수정 모달 닫기
    closeEditModal() {
      this.isEditModalOpen = false;
    },
    // 수정 저장 후 처리
    onEditSaved(updatedBoard) {
      this.board = updatedBoard; // 수정된 게시글 데이터 반영
      this.closeEditModal(); // 모달 닫기
    },
  },
  mounted() {
    this.fetchBoardDetail(); // 컴포넌트 마운트 시 데이터 로드
  },
};
</script>

<style scoped>
@import "https://cdn.quilljs.com/1.3.7/quill.snow.css";

.board-detail {
  padding-top: 70px;
  width: 1180px;
  margin-left: 140px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.board-info {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
  margin-bottom: 20px;
}

.board-content {
  padding: 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.quill-content {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.button-group {
  text-align: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2c5987;
}

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
  border-radius: 15px;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>
