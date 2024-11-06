<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>직원 상세 정보</h2>
      <p class="info-item"><strong>이름:</strong> {{ user.name }}</p>
      <p class="info-item"><strong>이메일:</strong> {{ user.email }}</p>
      <p class="info-item"><strong>부서:</strong> {{ user.department }}</p>
      <p class="info-item"><strong>직위:</strong> {{ user.jobtitle }}</p>
      <p class="info-item"><strong>연락처:</strong> {{ user.userPhone }}</p>
      <p class="info-item"><strong>상태:</strong> {{ user.status }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    closeModal: Function,
    user: Object
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  /* margin: 15% auto; */
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.info-item {
  margin-top: 10px;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
}
</style>