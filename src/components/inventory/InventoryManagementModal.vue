<template>
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">재고 관리</h3>
        <div class="button-group">

          <button class="jump-button" @click="openActionModal('입고')">입고</button>
          <button class="jump-button" @click="openActionModal('출고')">출고</button>
          <button class="jump-button" @click="openActionModal('소모')">소모</button>
          <button class="jump-button" @click="openActionModal('조정')">조정</button>

    </div>
        <button class="jump-button" @click="$emit('close')" style="background-color: red; color: white; float: right;">닫기</button>
      </div>
    </div>
  </template>
  
  <script setup>
import { defineProps, defineEmits } from 'vue';
  
  
  const props = defineProps({// eslint-disable-line no-unused-vars
    isOpen: Boolean,
  });
  
  const emit = defineEmits(['close','open-action-modal']);
  
  function openActionModal(actionType) {
      // 각 기능별 모달을 여는 로직 추가
      emit('open-action-modal', actionType);
  }
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-title {
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 800px; /* 가로 너비 증가 */
  max-width: 95%;
  max-height: 90vh; /* 높이를 제한하여 스크롤 가능 */
  overflow-y: auto; /* 스크롤 활성화 */
}
.modal-form {
  display: flex;
  flex-direction: column;
}
.button-group {
  display: flex;
  justify-content: center; 
  gap: 10px; /* 두 버튼 사이 간격 */
  margin-top: 20px;
}
button{
    padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  }

  .action-buttons button {
    padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  }
  .close-button {
    padding: 10px 20px;
  font-size: 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: inline-end;
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
  transition:
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}
  </style>
  