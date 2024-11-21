<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ productionName }} - 원재료 상세보기</h3>
        
        <!-- 원재료 데이터 목록 -->
        <ul v-if="materials.length > 0" class="material-list">
          <li v-for="(material, index) in materials" :key="index">
            원재료: {{ material.productMaterialName }} | 사용량: {{ material.materialQuantity }}
          </li>
        </ul>
  
        <!-- 데이터가 없을 경우 메시지 표시 -->
        <p v-else>등록된 원재료가 없습니다.</p>

        <!-- 생산 분석 데이터 -->
        <h4>생산 분석</h4>
        <div v-if="productionAnalysis">
        <p><strong>차질 원인:</strong> {{ productionAnalysis?.issueCause }}</p>
        <p><strong>개선 사항:</strong> {{ productionAnalysis?.improvements }}</p>
      </div>
      <p v-else>생산 분석 데이터가 없습니다.</p>

        
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({// eslint-disable-line no-unused-vars
    materials: Array, // 원재료 데이터
    productionName: String, // 생산 이름
    productionAnalysis: Object, // 생산 분석 데이터
    isOpen: Boolean, // 모달 상태
  });
  
  const emit = defineEmits(['close']);
  
  function closeModal() {
    emit('close');
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
  
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 600px; /* 적절한 가로 너비 */
    max-width: 90%;
  }
  
  .material-list {
    max-height: 300px; /* 내부 리스트의 높이 제한 */
    overflow-y: auto; /* 스크롤 활성화 */
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  
  .material-list li {
    margin-bottom: 10px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #3f72af;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  