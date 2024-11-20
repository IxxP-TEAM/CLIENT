<template>
  <div class="modal-overlay" @click.self="cancel">
    <div class="modal-content">
      <h2 class="modal-title">
        {{ isEditMode ? "게시글 수정" : "게시글 작성" }}
      </h2>
      <form @submit.prevent="submitBoard" class="form-container">
        <div class="form-item">
          <label for="type" class="form-label">게시판 타입</label>
          <select v-model="board.type" id="type" class="form-select" required>
            <option value="NOTICE">공지사항</option>
            <option value="FREE">자유게시판</option>
            <option value="ANONYMOUS">익명게시판</option>
          </select>
        </div>
        <div class="form-item">
          <label for="title" class="form-label">제목</label>
          <input
            v-model="board.title"
            id="title"
            type="text"
            class="form-input"
            required
          />
        </div>
        <div class="form-item">
          <label for="content" class="form-label">내용</label>
          <div ref="quillEditor" class="quill-editor"></div>
        </div>
        <div class="form-item" v-if="userRole && userRole === 'ADMIN'">
          <label for="isPinned" class="form-label">공지 여부</label>
          <input
            type="checkbox"
            v-model="board.isPinned"
            id="isPinned"
            class="form-checkbox"
          />
        </div>
        <div class="button-group">
          <button type="submit" class="btn btn-primary">
            {{ isEditMode ? "수정" : "작성" }}
          </button>
          <button type="button" class="btn btn-secondary" @click="cancel">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.snow.css";
import apiService from "@/api/apiService";
import VueJwtDecode from "vue-jwt-decode";

export default {
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },
    boardData: {
      type: Object,
      default: () => ({
        boardId: null,
        title: "",
        content: "",
        type: "FREE",
        isPinned: false,
        writerName: "",
      }),
    },
  },
  data() {
    return {
      board: { ...this.boardData }, // 로컬에서 다룰 데이터
      userRole: null, // 사용자 역할
      quill: null, // Quill 에디터 인스턴스
    };
  },
  methods: {
    // 사용자 역할 확인
    async fetchUserRole() {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const decoded = VueJwtDecode.decode(token);
          this.userRole = decoded.role;
        }
      } catch (error) {
        console.error("사용자 역할 로드 실패:", error.message);
      }
    },
    // Quill 에디터 초기화
    initQuillEditor() {
      if (this.quill) {
        this.quill.destroy();
        this.quill = null;
      }
      this.quill = new Quill(this.$refs.quillEditor, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
        placeholder: "내용을 입력하세요...",
      });
      this.quill.root.innerHTML = this.board.content || "";
    },
    // 이미지 업로드 처리
    async uploadImageToS3() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) {
          console.error("파일이 선택되지 않았습니다.");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await apiService.uploadImage(formData);
          const imageUrl = response.data?.url || response.data;
          if (!imageUrl) {
            console.error("S3 URL을 찾을 수 없습니다.");
            return;
          }

          const range = this.quill.getSelection() || {
            index: this.quill.getLength(),
          };

          this.quill.insertEmbed(range.index, "image", imageUrl);

          console.log("이미지 삽입 성공:", imageUrl);
        } catch (error) {
          console.error("S3 업로드 실패:", error.message);
        }
      };
    },
    // 작성 또는 수정 데이터 전송
    async submitBoard() {
      try {
        const contentHTML = this.quill.root.innerHTML;
        this.board.content = contentHTML;

        if (this.isEditMode) {
          if (!this.board.boardId) {
            alert("게시글 ID가 없습니다.");
            return;
          }
         await apiService.updateBoard(this.board.boardId, this.board);
        //this.$emit("saved", response.data); // 수정된 데이터 부모로 전달

        // 수정 후 새로고침
        window.location.reload();
        } else {
          const response = await apiService.createBoard(this.board);
          this.$emit("saved", response.data); // 부모로 데이터 전달
        }

      this.$emit("close"); // 폼 닫기 이벤트
      // 새로고침
      //window.location.reload();
      } catch (error) {
        console.error("게시글 저장 실패:", error.message);
      }
    },
    // 취소 버튼 처리
    cancel() {
      this.$emit("close");
    },
  },
  mounted() {
    this.fetchUserRole();
    this.initQuillEditor();
  },
  beforeUnmount() {
    if (this.quill) {
      this.quill = null;
    }
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
  border-radius: 15px;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-item {
  width: 100%;
  margin-bottom: 15px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 8px;
}

.form-select,
.form-input,
.form-checkbox {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.quill-editor {
  border: 1px solid #ccc;
  min-height: 200px;
  border-radius: 10px;
  background: #f9f9f9;
  padding: 10px;
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #3f72af;
  color: white;
}

.btn-primary:hover {
  background-color: #315a8d;
}

.btn-secondary {
  background-color: gray;
  color: white;
}

.btn-secondary:hover {
  background-color: #4a4a4a;
}
</style>
