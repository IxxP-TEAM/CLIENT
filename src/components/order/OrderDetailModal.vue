<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <header>
        <h2 class="modal-title">주문 세부 정보</h2>
        <button class="close-btn" @click="close">X</button>
      </header>

      <div v-if="order" class="info-sections">
        <!-- 주문 요약 -->
        <div class="info-section">
          <h3 class="section-title">주문 요약</h3>
          <div class="info-grid">
            <div
              class="info-card"
              v-for="(value, label, index) in orderSummary"
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

        <!-- 결제 및 배송 정보 -->
        <div class="info-section">
          <h3 class="section-title">결제 및 배송 정보</h3>
          <div class="info-grid">
            <div
              class="info-card"
              v-for="(value, label, index) in paymentShippingInfo"
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

        <!-- 고객 정보 -->
        <div class="info-section">
          <h3 class="section-title">고객 정보</h3>
          <div class="info-grid">
            <div
              class="info-card"
              v-for="(value, label, index) in customerInfo"
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

        <!-- 주문 메모 -->
        <div v-if="order.orderNote" class="info-section">
          <h3 class="section-title">주문 메모</h3>
          <p class="info-value">{{ order.orderNote }}</p>
        </div>

        <!-- 주문 상품 목록 -->
        <div class="info-section">
          <h3 class="section-title">주문 상품 목록</h3>
          <table
            class="product-table"
            v-if="order.products && order.products.length > 0"
          >
            <thead>
              <tr>
                <th>제품명</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in order.products" :key="index">
                <td>{{ product.productName }}</td>
                <td>{{ product.quantity }}개</td>
                <td>₩{{ product.price.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>상품 목록이 없습니다.</p>
        </div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <button class="edit-button" @click="editOrder">수정하기</button>
        <button class="close-button" @click="close">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    orderSummary() {
      return {
        '주문 번호': this.order.orderId,
        주문일: this.order.orderDate,
        '주문 상태': this.order.orderStatus,
        '총 금액': `₩${this.order.totalAmount.toLocaleString()}`,
      }
    },
    paymentShippingInfo() {
      return {
        '결제 방법': this.order.paymentMethod,
        '결제 상태': this.order.paymentStatus,
        '배송 주소': this.order.shippingAddr,
        '배송 시작일': this.order.shippingSdate,
        '배송 상태': this.order.shippingStatus,
      }
    },
    customerInfo() {
      return {
        고객사: this.order.customerName,
        '담당자 이름': this.order.userName,
      }
    },
    infoIcons() {
      return {
        '주문 번호': 'fas fa-receipt',
        주문일: 'fas fa-calendar-alt',
        '주문 상태': 'fas fa-info-circle',
        '총 금액': 'fas fa-dollar-sign',
        '결제 방법': 'fas fa-credit-card',
        '결제 상태': 'fas fa-check-circle',
        '배송 주소': 'fas fa-map-marker-alt',
        '배송 시작일': 'fas fa-calendar-check',
        '배송 상태': 'fas fa-shipping-fast',
        고객사: 'fas fa-building',
        '담당자 이름': 'fas fa-user',
      }
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    editOrder() {
      this.$emit('edit', this.order)
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

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #3f72af;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4caf50;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-section {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-icon-container {
  background: #3f72af;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.info-icon {
  font-size: 16px;
}

.info-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.info-value {
  color: #555;
  font-size: 14px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.product-table th,
.product-table td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
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

button:active {
  background-color: #1e3f5f;
  transform: translateY(0);
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

.modal-content::-webkit-scrollbar {
  display: none;
}
</style>
