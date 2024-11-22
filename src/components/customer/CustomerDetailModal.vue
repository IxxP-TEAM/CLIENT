<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2 class="modal-title">고객사 세부 정보</h2>

      <div class="info-sections">
        <!-- 기본 정보 -->
        <div class="info-section">
          <h3 class="section-title">기본 정보</h3>
          <div class="info-grid">
            <div
              class="info-card"
              v-for="(value, label, index) in basicInfo"
              :key="index"
            >
              <div class="info-icon-container">
                <i :class="infoIcons[label]" class="info-icon"></i>
              </div>
              <div class="info-details">
                <p class="info-label">{{ label }}</p>
                <p class="info-value" :class="{ highlight: label === '상태' }">
                  {{ value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 담당자 정보 -->
        <div class="info-section">
          <h3 class="section-title">담당자 정보</h3>
          <div class="info-grid">
            <div
              class="info-card"
              v-for="(value, label, index) in contactInfo"
              :key="index"
            >
              <div class="info-icon-container">
                <i :class="infoIcons[label]" class="info-icon"></i>
              </div>
              <div class="info-details">
                <p class="info-label">{{ label }}</p>
                <p class="info-value">{{ value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <button class="edit-button" @click="$emit('edit', customerDetails)">
          수정하기
        </button>
        <button class="close-button" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customerDetails: {
      type: Object,
      required: true,
    },
  },
  computed: {
    basicInfo() {
      return {
        이름: this.customerDetails.customerName,
        전화번호: this.customerDetails.customerPhone,
        주소: this.customerDetails.customerAddress,
        '상세 주소': this.customerDetails.customerAdddetail,
        사업자등록번호: this.customerDetails.registrationNumber,
        상태: this.customerDetails.customerStatus,
        시작일: this.customerDetails.customerSdate,
        메모: this.customerDetails.customerNote,
      }
    },
    contactInfo() {
      return {
        '담당자 이름': this.customerDetails.customerPersonName,
        '담당자 전화번호': this.customerDetails.customerPersonPhone,
        '담당자 이메일': this.customerDetails.customerPersonEmail,
      }
    },
    infoIcons() {
      return {
        이름: 'fas fa-building',
        전화번호: 'fas fa-phone',
        주소: 'fas fa-map-marker-alt',
        '상세 주소': 'fas fa-map-marked-alt',
        '담당자 이름': 'fas fa-user',
        '담당자 전화번호': 'fas fa-mobile-alt',
        '담당자 이메일': 'fas fa-envelope',
        사업자등록번호: 'fas fa-id-card',
        상태: 'fas fa-info-circle',
        시작일: 'fas fa-calendar-alt',
        메모: 'fas fa-sticky-note',
      }
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-size: 28px;
  font-weight: bold;
  color: #3f72af;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  color: black;
  margin-bottom: 15px;
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.info-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3f72af;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.info-icon {
  font-size: 18px;
}

.info-details {
  flex: 1;
}

.info-label {
  font-weight: bold;
  color: #333;
}

.info-value {
  color: #555;
  margin-top: 5px;
  font-size: 14px;
}

.info-value.highlight {
  font-weight: bold;
  color: #3f72af;
  font-size: 16px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

button {
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #2c5987;
  transform: translateY(-3px);
}

.edit-button {
  background-color: #3f72af;
}

.edit-button:hover {
  background-color: #2c5987;
}

.close-button {
  background-color: gray;
}

.close-button:hover {
  background-color: #333;
}

/* 스크롤바를 숨기기 위한 스타일 */
.modal-content::-webkit-scrollbar {
  display: none;
}
</style>
