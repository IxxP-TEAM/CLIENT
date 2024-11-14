<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <header>
        <h3>주문 세부 정보</h3>
        <button class="close-btn" @click="close">X</button>
      </header>
      <div v-if="order" class="detail-info">
        <!-- 주문 요약 카드 -->
        <section class="order-summary">
          <p><strong>주문 번호:</strong> {{ order.orderId }}</p>
          <p><strong>주문일:</strong> {{ order.orderDate }}</p>
          <p><strong>주문 상태:</strong> <span :class="`status-${order.orderStatus}`">{{ order.orderStatus }}</span></p>
          <p><strong>총 금액:</strong> ₩{{ order.totalAmount.toLocaleString() }}</p>
        </section>
        
        <!-- 결제 및 배송 정보 카드 -->
        <section class="payment-shipping-info">
          <div>
            <h4>결제 정보</h4>
            <p><strong>결제 방법:</strong> {{ order.paymentMethod }}</p>
            <p><strong>결제 상태:</strong> {{ order.paymentStatus }}</p>
          </div>
          <div>
            <h4>배송 정보</h4>
            <p><strong>배송 주소:</strong> {{ order.shippingAddr }}</p>
            <p><strong>배송 시작일:</strong> {{ order.shippingSdate }}</p>
            <p><strong>배송 상태:</strong> {{ order.shippingStatus }}</p>
          </div>
        </section>

        <!-- 고객사 및 담당자 정보 -->
        <section class="customer-info">
          <p><strong>고객사:</strong> {{ order.customerName }}</p>
          <p><strong>담당자 이름:</strong> {{ order.userName }}</p>
        </section>

        <!-- 할인 및 세금 정보 카드 -->
        <section class="discount-tax">
          <p><strong>총 금액:</strong> ₩{{ order.totalAmount ? order.totalAmount.toLocaleString() : '0' }}</p>
          <p><strong>할인 금액:</strong> ₩{{ order.discountAmount ? order.discountAmount.toLocaleString() : '0' }}</p>
          <p><strong>세금 금액:</strong> ₩{{ order.taxAmount ? order.taxAmount.toLocaleString() : '0' }}</p>
        </section>

        <!-- 주문 메모 -->
        <section v-if="order.orderNote" class="order-note">
          <h4>주문 메모</h4>
          <p>{{ order.orderNote }}</p>
        </section>

        <!-- 주문 상품 목록 테이블 -->
        <section class="product-list">
          <h4>주문 상품 목록</h4>
          <table v-if="order.products && order.products.length > 0">
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
        </section>
      </div>
      <div class="button-group">
        <button @click="editOrder">수정하기</button>
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
  methods: {
    close() {
      this.$emit('close');
    },
    editOrder() {
      this.$emit('edit', this.order);
    },
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
  padding: 20px;
  border-radius: 8px;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #888;
}

h3 {
  font-size: 1.5em;
  margin: 0;
  color: #3f72af;
}

.detail-info section {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9fafb;
}

.order-summary, .payment-shipping-info, .discount-tax {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-shipping-info {
  display: flex;
  justify-content: space-between;
}

h4 {
  color: #3f72af;
  margin-bottom: 8px;
}

.status-대기 {
  color: #ff9800;
}

.status-완료 {
  color: #4caf50;
}

.status-취소 {
  color: #f44336;
}

.product-list table {
  width: 100%;
  border-collapse: collapse;
}

.product-list th, .product-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #2c5987;
}
</style>
