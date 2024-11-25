<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="modal-title">{{ productionName }} - 원재료 상세보기</h2>
      <div class="info-sections">
        <div class="info-section">
          <h3 class="section-title">기본 정보</h3>
          <div class="info-grid">
            <ul v-if="materials.length > 0" class="material-list">
              <li v-for="(material, index) in materials" :key="index" class="material-item">
                <span class="material-name">재료 이름:</span>
                <span class="material-value">{{ material.productMaterialName }}</span> ,
                <span class="material-name">사용량:</span>
                <span class="material-value">{{ material.materialQuantity }}</span>
              </li>
            </ul>
            <p v-else class="no-data">등록된 원재료가 없습니다.</p>
          </div>
        </div>
        <div class="info-section">
          <h3 class="section-title">생산 분석</h3>
          <div v-if="productionAnalysis">
            <p><span class="analysis-label">차질 원인:</span> {{ productionAnalysis.issueCause }}</p>
            <p><span class="analysis-label">개선 사항:</span> {{ productionAnalysis.improvements }}</p>
          </div>
          <p v-else class="no-data">생산 분석 데이터가 없습니다.</p>
        </div>
      </div>
      <div class="button-group">
        <button class="jump-button close-button" @click="closeModal" style="background-color: gray;">닫기</button>
      </div>
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
  border-radius: 12px;
  width: 800px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  color: #3f72af;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-section {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #3f72af;
  margin-bottom: 15px;
}

.material-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.material-item {
  font-size: 16px;
  color: #555;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.material-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.material-name {
  font-weight: bold;
  color: #3f72af;
}

.material-value {
  color: #333;
}

.analysis-label {
  font-weight: bold;
  color: #3f72af;
}

.no-data {
  color: #777;
  font-size: 16px;
  text-align: center;
  padding: 10px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
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
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-3px);
}

.jump-button:active {
  transform: translateY(2px);
}

.close-button {
  background-color: red;
  color: white;
}

.close-button:hover {
  background-color: #b22222;
}

  </style>
  