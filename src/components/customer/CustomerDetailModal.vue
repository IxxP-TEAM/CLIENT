<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <h2>고객사 세부 정보</h2>
        <div class="detail-info">
          <p><strong>이름:</strong> {{ customerDetails.customerName }}</p>
          <p><strong>전화번호:</strong> {{ customerDetails.customerPhone }}</p>
          <p><strong>주소:</strong> {{ customerDetails.customerAddress }}</p>
          <p><strong>상세 주소:</strong> {{ customerDetails.customerAdddetail }}</p>
          <p><strong>담당자 이름:</strong> {{ customerDetails.customerPersonName }}</p>
          <p><strong>담당자 전화번호:</strong> {{ customerDetails.customerPersonPhone }}</p>
          <p><strong>담당자 이메일:</strong> {{ customerDetails.customerPersonEmail }}</p>
          <p><strong>사업자등록번호:</strong> {{ customerDetails.registrationNumber }}</p>
          <p><strong>상태:</strong> {{ customerDetails.customerStatus }}</p>
          <p><strong>시작일:</strong> {{ customerDetails.customerSdate }}</p>
          <p><strong>메모:</strong> {{ customerDetails.customerNote }}</p>
        </div>
        <!-- 버튼 그룹 -->
        <div class="button-group">
          <button @click="$emit('edit', customerDetails)">수정하기</button>
          <button @click="$emit('close')">닫기</button>
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
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 800px; /* CustomerForm과 동일한 너비 */
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  /* 스크롤바를 숨기기 위한 스타일 */
  .modal-content::-webkit-scrollbar {
    display: none;
  }
  .modal-content {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .detail-info p {
    margin: 0;
    padding: 8px 0;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    color: #333;
  }
  
  /* CustomerForm의 button 스타일과 일치시키기 */
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
    border-radius: 4px;
    width: 150px;
    padding: 12px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #2c5987;
  }
  
  /* 삭제 버튼 스타일 변경 */
  button:nth-child(2) {
    background-color: gray;
    color: white;
    border: 2px solid gray;
  }
  
  button:nth-child(2):hover {
    background-color: rgb(80, 80, 80);
  }
  </style>
  