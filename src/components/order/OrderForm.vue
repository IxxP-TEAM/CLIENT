<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ isEditMode ? '주문 수정' : '주문 등록' }}</h2>
      <form @submit.prevent="handleSubmit" class="grid-form">
        <!-- 고객사 선택 필드 -->
        <div class="grid-item full-width icon-input">
          <label for="customerField">고객사</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="customerField"
              v-model="formData.customerName"
              placeholder="고객사 검색"
              class="form-control"
              @focus="showCustomerSelector = true"
              readonly
            />
            <i class="fas fa-search icon"></i>
            <!-- 돋보기 아이콘 -->
          </div>
        </div>

        <!-- 담당자 선택 필드 -->
        <div class="grid-item full-width icon-input">
          <label for="userField">담당자</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="userField"
              v-model="selectedUserName"
              placeholder="담당자 검색"
              class="form-control"
              @focus="showUserSelector = true"
              readonly
            />
            <i class="fas fa-search icon"></i>
            <!-- 돋보기 아이콘 -->
          </div>
        </div>

        <!-- 주문 정보 -->
        <div class="grid-item">
          <label for="orderDate">주문일</label>
          <input
            v-model="formData.orderDate"
            type="date"
            id="orderDate"
            class="form-control"
            required
          />
        </div>
        <div class="grid-item">
          <label for="orderStatus">주문 상태</label>
          <select
            v-model="formData.orderStatus"
            id="orderStatus"
            class="form-control"
            required
          >
            <option value="대기">대기</option>
            <option value="완료">완료</option>
            <option value="취소">취소</option>
          </select>
        </div>
        <div class="grid-item">
          <label for="paymentMethod">결제 방법</label>
          <select
            v-model="formData.paymentMethod"
            id="paymentMethod"
            class="form-control"
            required
          >
            <option value="카드">카드</option>
            <option value="계좌이체">계좌 이체</option>
            <option value="현금">현금</option>
          </select>
        </div>
        <div class="grid-item">
          <label for="paymentStatus">결제 상태</label>
          <select
            v-model="formData.paymentStatus"
            id="paymentStatus"
            class="form-control"
            required
          >
            <option value="미결제">미결제</option>
            <option value="결제완료">결제 완료</option>
          </select>
        </div>

        <!-- 배송 정보 -->
        <div class="grid-item full-width">
          <label for="shippingAddr">배송 주소</label>
          <input
            v-model="formData.shippingAddr"
            type="text"
            id="shippingAddr"
            class="form-control"
            required
          />
        </div>
        <div class="grid-item">
          <label for="shippingSdate">배송 시작일</label>
          <input
            v-model="formData.shippingSdate"
            type="date"
            id="shippingSdate"
            class="form-control"
            required
          />
          <p v-if="dateErrorMessage" class="error-message">{{ dateErrorMessage }}</p>
        </div>
        <div class="grid-item">
          <label for="shippingStatus">배송 상태</label>
          <select
            v-model="formData.shippingStatus"
            id="shippingStatus"
            class="form-control"
            required
          >
            <option value="미출발">미출발</option>
            <option value="배송중">배송중</option>
            <option value="배송완료">배송 완료</option>
          </select>
        </div>

        <!-- 제품 선택 필드 -->
        <div class="grid-item full-width icon-input">
          <label for="productField">제품 선택</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="productField"
              :placeholder="productPlaceholder"
              :title="selectedProductNames"
              class="form-control"
              @focus="openProductSelector"
              readonly
            />
            <i class="fas fa-search icon"></i>
          </div>
        </div>

        <!-- 선택된 제품 목록 표시 -->
        <div
          v-if="formData.products.length"
          class="selected-products full-width"
        >
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
                <td>
                  <input
                    v-model="product.quantity"
                    type="number"
                    min="1"
                    class="table-input"
                  />
                </td>
                <td>
                  <input
                    v-model="product.discount"
                    type="number"
                    min="0"
                    max="100"
                    class="table-input"
                  />
                </td>
                <td>
                  <button
                    @click.prevent="removeProduct(index)"
                    class="delete-btn"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 제품, 사용자, 고객사 선택 모달 -->
        <ProductSelector
          v-if="showProductSelector"
          :productOptions="productOptions"
          @confirm-selection="addSelectedProducts"
          @close="showProductSelector = false"
        />
        <UserSelector
          v-if="showUserSelector"
          @user-selected="selectUser"
          @close="showUserSelector = false"
        />
        <CustomerSelector
          v-if="showCustomerSelector"
          @customer-selected="selectCustomer"
          @close="showCustomerSelector = false"
        />

        <!-- 주문 메모 필드  -->
        <div class="grid-item full-width">
          <label for="orderNote">주문 메모</label>
          <textarea
            v-model="formData.orderNote"
            id="orderNote"
            class="form-control full-width"
            rows="4"
          ></textarea>
        </div>

        <!-- 버튼 그룹  -->
        <div class="button-group full-width">
          <button type="submit" class="submit-btn">
            {{ isEditMode ? '수정' : '등록' }}
          </button>
          <button type="button" @click="close" class="cancel-btn">취소</button>
        </div>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService'
import VueJwtDecode from 'vue-jwt-decode'
import ProductSelector from './ProductSelector.vue'
import UserSelector from './UserSelector.vue'
import CustomerSelector from './CustomerSelector.vue'

export default {
  components: {
    ProductSelector,
    UserSelector,
    CustomerSelector,
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
        customerName: '', // 고객사 이름 추가
        orderDate: '',
        orderStatus: '대기',
        paymentMethod: '카드',
        paymentStatus: '미결제',
        shippingAddr: '',
        shippingSdate: '',
        shippingStatus: '미출발',
        products: [],
        orderNote: '',
      },
      message: '',
      dateErrorMessage: '',
      productOptions: [],
      showProductSelector: false,
      showUserSelector: false,
      showCustomerSelector: false,
      selectedUserName: '',
    }
  },
  watch: {
    'formData.orderDate'(newOrderDate) {
      const today = new Date()
      const orderDate = new Date(newOrderDate)
      if (orderDate > today) {
        this.dateErrorMessage = '주문일은 오늘을 넘을 수 없습니다.'
      } else {
        this.dateErrorMessage = '' // 유효할 경우 메시지 초기화
      }
    },
    'formData.shippingSdate'(newShippingSdate) {
      const orderDate = new Date(this.formData.orderDate)
      const shippingSdate = new Date(newShippingSdate)
      if (this.formData.orderDate && shippingSdate < orderDate) {
        this.dateErrorMessage = '배송 시작일은 주문일 이후여야 합니다.'
      } else {
        this.dateErrorMessage = '' // 유효할 경우 메시지 초기화
      }
    },
  },
  mounted() {
    this.getUserIdFromToken()
    this.fetchProductOptions()
    if (this.isEditMode) {
      this.formData = {
        ...this.orderData,
        products: this.orderData.products.map(product => ({
          ...product,
          discount: 0, // 할인율을 무조건 0으로 초기화
        })),
      }
    } else {
      this.resetFormData()
    }
  },
  computed: {
    selectedProductNames() {
      return this.formData.products
        .map(product => product.productName)
        .join(', ')
    },
    productPlaceholder() {
      const names = this.formData.products.map(product => product.productName)
      if (names.length > 2) {
        return `${names.slice(0, 2).join(', ')}...`
      }
      return names.join(', ')
    },
  },
  methods: {
    selectCustomer(customer) {
      this.formData.customerId = customer.customerId
      this.formData.customerName = customer.customerName || customer.name // 고객사 이름을 필드에 반영
      this.showCustomerSelector = false
    },
    selectUser(user) {
      this.formData.userId = user.userIdx
      this.selectedUserName = user.name
      this.showUserSelector = false
    },
    async fetchProductOptions() {
      try {
        const response = await apiService.getProducts()
        this.productOptions = response.data.data.elements || []
      } catch (error) {
        console.error('제품 목록을 불러오는 중 오류가 발생했습니다:', error)
      }
    },
    openProductSelector() {
      this.showProductSelector = true
    },
    addSelectedProducts(selectedProducts) {
      selectedProducts.forEach(product => {
        const exists = this.formData.products.find(
          p => p.productId === product.productId
        )
        if (!exists) {
          this.formData.products.push({
            productId: product.productId,
            productName: product.productName,
            productPrice: product.productPrice,
            quantity: 1,
            discount: 0,
          })
        }
      })
      this.showProductSelector = false
    },
    removeProduct(index) {
      this.formData.products.splice(index, 1)
    },
    async getUserIdFromToken() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const decodedToken = VueJwtDecode.decode(token)
          this.formData.userId = decodedToken.userId
        } catch (error) {
          console.error('토큰 디코딩 오류:', error)
        }
      }
    },
    async handleSubmit() {
    // 유효성 검사 메시지가 있을 경우 제출 방지
    if (this.dateErrorMessage) {
      this.message = this.dateErrorMessage;
      return;
    }
    
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
      this.$emit('close')
      this.resetFormData()
    },
    resetFormData() {
      this.formData = {
        userId: '',
        customerId: '',
        customerName: '',
        orderDate: '',
        orderStatus: '대기',
        paymentMethod: '카드',
        paymentStatus: '미결제',
        shippingAddr: '',
        shippingSdate: '',
        shippingStatus: '미출발',
        products: [],
        orderNote: '',
      }
      this.selectedUserName = ''
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
  width: 800px; /* 가로 너비 증가 */
  max-width: 95%;
  max-height: 90vh; /* 높이를 제한하여 스크롤 가능 */
  overflow-y: auto; /* 스크롤 활성화 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* 스크롤바 숨기기 */
.modal-content::-webkit-scrollbar {
  display: none;
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

.selected-products {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 10px;
  width: 100%;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: 10px;
  border: 1px solid #dfe6e9;
  text-align: center;
}

.product-table th {
  background-color: #f1f2f6;
  font-weight: bold;
}

.table-input {
  width: 60px;
  text-align: center;
}

.button-group {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  gap: 20px;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  width: 150px; /* 버튼 너비 고정 */
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 제출 버튼 스타일 */
.submit-btn {
  background-color: #3f72af;
}
.submit-btn:hover {
  background-color: #2c5987;
}

/* 취소 버튼 스타일 */
.cancel-btn {
  background-color: gray;
}
.cancel-btn:hover {
  background-color: gray;
}

input,
select,
textarea {
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

input.invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.9em;
}

.message {
  color: #3f72af;
  font-size: 1.2em;
  text-align: center;
  margin-top: 20px;
}

.icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}

.icon-input {
  position: relative;
}

.input-wrapper {
  position: relative;
}
</style>
