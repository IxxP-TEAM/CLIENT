<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ isEditMode ? '주문 수정' : '주문 등록' }}</h2>
      <form @submit.prevent="handleSubmit" class="grid-form">

        <!-- 고객 정보 -->
        <div class="grid-item">
          <label for="customerId">고객사 ID</label>
          <input v-model="formData.customerId" type="text" id="customerId" required />
        </div>

        <!-- 주문 정보 -->
        <div class="grid-item">
          <label for="orderDate">주문일</label>
          <input v-model="formData.orderDate" type="date" id="orderDate" required />
        </div>
        <div class="grid-item">
          <label for="orderStatus">주문 상태</label>
          <select v-model="formData.orderStatus" id="orderStatus" required>
            <option value="대기">대기</option>
            <option value="완료">완료</option>
            <option value="취소">취소</option>
          </select>
        </div>
        <div class="grid-item">
          <label for="paymentMethod">결제 방법</label>
          <select v-model="formData.paymentMethod" id="paymentMethod" required>
            <option value="카드">카드</option>
            <option value="계좌이체">계좌 이체</option>
            <option value="현금">현금</option>
          </select>
        </div>
        <div class="grid-item">
          <label for="paymentStatus">결제 상태</label>
          <select v-model="formData.paymentStatus" id="paymentStatus" required>
            <option value="미결제">미결제</option>
            <option value="결제완료">결제 완료</option>
          </select>
        </div>

        <!-- 배송 정보 -->
        <div class="grid-item">
          <label for="shippingAddr">배송 주소</label>
          <input v-model="formData.shippingAddr" type="text" id="shippingAddr" required />
        </div>
        <div class="grid-item">
          <label for="shippingSdate">배송 시작일</label>
          <input v-model="formData.shippingSdate" type="date" id="shippingSdate" required />
        </div>
        <div class="grid-item">
          <label for="shippingStatus">배송 상태</label>
          <select v-model="formData.shippingStatus" id="shippingStatus" required>
            <option value="미출발">미출발</option>
            <option value="배송중">배송중</option>
            <option value="배송완료">배송 완료</option>
          </select>
        </div>
        
        <!-- 사용자 선택 버튼 추가 -->
        <div class="grid-item full-width">
          <button type="button" @click="showUserSelector = true" class="select-user-btn">담당자 선택</button>
          <input v-model="formData.userId" type="hidden" id="userId" required />
          <p v-if="selectedUserName">담당자: {{ selectedUserName }}</p>
        </div>        

        <!-- 제품 선택 버튼 -->
        <div class="grid-item full-width">
          <button type="button" @click="openProductSelector" class="select-product-btn">제품 선택</button>
        </div>

        <!-- 선택된 제품 목록 표시 -->
        <div v-if="formData.products.length" class="selected-products">
          <h3>선택된 제품</h3>
          <table class="product-table">
            <thead>
              <tr>
                <th>제품명</th>
                <th>수량</th>
                <th>할인율 (%)</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in formData.products" :key="index">
                <td>{{ product.productName }}</td>
                <td><input v-model="product.quantity" type="number" min="1" class="table-input" /></td>
                <td><input v-model="product.discount" type="number" min="0" max="100" class="table-input" /></td>
                <td><button @click.prevent="removeProduct(index)" class="delete-btn">삭제</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 제품 선택 모달 -->
        <ProductSelector
          v-if="showProductSelector"
          :productOptions="productOptions"
          @confirm-selection="addSelectedProducts"
          @close="showProductSelector = false"
        />

        <!-- 사용자 선택 모달 -->
        <UserSelector
          v-if="showUserSelector"
          @user-selected="selectUser"
          @close="showUserSelector = false"
        />        

        <!-- 주문 메모 -->
        <div class="grid-item full-width">
          <label for="orderNote">주문 메모</label>
          <textarea v-model="formData.orderNote" id="orderNote" rows="4"></textarea>
        </div>

        <!-- 버튼 그룹 -->
        <div class="button-group">
          <button type="submit" class="submit-btn">{{ isEditMode ? '수정' : '등록' }}</button>
          <button type="button" @click="close" class="cancel-btn">취소</button>
        </div>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService';
import VueJwtDecode from 'vue-jwt-decode';
import ProductSelector from './ProductSelector.vue';
import UserSelector from './UserSelector.vue';

export default {
  components: {
    ProductSelector,
    UserSelector
  },
  props: {
    orderData: {
      type: Object,
      default: () => ({}),
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: { 
        userId: '', 
        customerId: '', 
        orderDate: '', 
        orderStatus: '대기', 
        paymentMethod: '카드', 
        paymentStatus: '미결제', 
        shippingAddr: '', 
        shippingSdate: '', 
        shippingStatus: '미출발', 
        products: [], 
        orderNote: '' 
      },
      message: '',
      productOptions: [],
      showProductSelector: false,
      showUserSelector: false,
    };
  },
  mounted() {
    this.getUserIdFromToken();
    this.fetchProductOptions();
    if (this.isEditMode) {
      this.formData = { ...this.orderData };
    } else {
      this.resetFormData();
    }
  },
  methods: {
    selectUser(user) {
    // userIdx를 userId로 설정
    this.formData.userId = user.userIdx;
    this.selectedUserName = user.name;
    this.showUserSelector = false; // 사용자 선택 모달 닫기
  },
    async fetchProductOptions() {
      try {
        const response = await apiService.getProducts();
        this.productOptions = response.data.data.elements || [];
      } catch (error) {
        console.error('제품 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
    openProductSelector() {
      this.showProductSelector = true;
    },
    addSelectedProducts(selectedProducts) {
      selectedProducts.forEach((product) => {
        const exists = this.formData.products.find((p) => p.productId === product.productId);
        if (!exists) {
          this.formData.products.push({ 
            productId: product.productId,
            productName: product.productName,
            productPrice: product.productPrice,
            quantity: 1,
            discount: 0,
          });
        }
      });
      this.showProductSelector = false;
    },
    removeProduct(index) {
      this.formData.products.splice(index, 1);
    },
    async getUserIdFromToken() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decodedToken = VueJwtDecode.decode(token);
          this.formData.userId = decodedToken.userId;
        } catch (error) {
          console.error('토큰 디코딩 오류:', error);
        }
      }
    },
    calculateTotal() {
      return this.formData.products.reduce((total, product) => {
        const price = product.productPrice * product.quantity;
        const discount = (price * product.discount) / 100;
        const tax = (price - discount) * 0.1;
        return total + price - discount + tax;
      }, 0).toFixed(2);
    },
    calculateDiscount() {
      return this.formData.products.reduce((total, product) => {
        const price = product.productPrice * product.quantity;
        return total + (price * product.discount) / 100;
      }, 0).toFixed(2);
    },
    calculateTax() {
      return this.formData.products.reduce((total, product) => {
        const price = product.productPrice * product.quantity;
        const discount = (price * product.discount) / 100;
        return total + (price - discount) * 0.1;
      }, 0).toFixed(2);
    },
    async handleSubmit() {
      try {
        if (this.isEditMode) {
          await apiService.updateOrder(this.formData.orderId, this.formData);
          this.message = '수정 성공';
        } else {
          await apiService.createOrder(this.formData);
          this.message = '등록 성공';
        }
        this.$emit('registered');
        this.close();
      } catch (error) {
        console.error('오류:', error);
        this.message = this.isEditMode ? '수정 실패' : '등록 실패';
      }
    },
    close() {
      this.$emit('close');
      this.resetFormData();
    },
    resetFormData() {
      this.formData = {
        userId: '',
        customerId: '',
        orderDate: '',
        orderStatus: '대기',
        paymentMethod: '카드',
        paymentStatus: '미결제',
        shippingAddr: '',
        shippingSdate: '',
        shippingStatus: '미출발',
        products: [],
        orderNote: ''
      };
    },
  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-content::-webkit-scrollbar {
  width: 0;
  background: transparent; /* 스크롤바 배경을 투명하게 */
}

.modal-content {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: span 2;
}

input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.table-input {
  width: 60px;
  text-align: center;
}

.selected-products {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%; 
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.product-table th,
.product-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.product-table th {
  background-color: #e0e7ff;
  font-weight: bold;
}

.product-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.select-product-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  width: 100%; /* 버튼 폭을 전체 넓이로 조정 */
}

.select-product-btn:hover {
  background-color: #45a049;
}

.submit-btn {
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  width: 150px;
  padding: 12px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2c5987;
}

.cancel-btn {
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  width: 150px;
  padding: 12px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c9302c;
}

.delete-btn {
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c9302c;
}

.message {
  color: #3f72af;
  margin-top: 15px;
  text-align: center;
}

.select-user-btn {
  background-color: #3f72af;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>