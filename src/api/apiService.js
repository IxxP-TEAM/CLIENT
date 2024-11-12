import api from './api';

export default {
  // 회원가입 요청
  registerUser(userData) {
    return api.post('/admin/join', userData);
  },

  login(userData) {
    return api.post('/users/login', userData);
  },
    // 고객사 등록 요청
    createCustomer(customerData) {
      return api.post('/customer/create', customerData);
    },
  
    // 고객사 목록 가져오기 요청
    fetchCustomerList() {
      return api.get('/customer/all'); // 고객사 목록을 가져오는 API 엔드포인트 설정
    },
  
    // 고객사 삭제 요청
    deleteCustomer(customerId) {
      return api.delete(`/customer/${customerId}`); // 고객사를 삭제하는 API 엔드포인트 설정
    },
  
    // 고객사 수정 요청
    updateCustomer(customerId, updatedData) {
      return api.patch(`/customer/${customerId}`, updatedData); // 고객사 정보를 수정하는 API 엔드포인트 설정
    },

    //고객사 세부 내역
    getCustomerDetails(customerId) {
      return api.get(`/customer/${customerId}`); 
    },    
    checkDuplicateRegistrationNumber(registrationNumber) {
      return api.post('/customer/check-duplicate-registration-number', { registrationNumber });
    },      

    // 비밀번호 - 이메일 인증 코드 요청
    sendResetPassword(email) {
      return api.post('/hr/email-code', { email });
    },
    
    // 비밀번호 재설정
    resetPassword(email, code, newPassword) {
      return api.post(`/hr/reset-pw`, {email, code, newPassword});
    },

    updateUser(userData) {
      return api.patch(`/hr/${userData.userIdx}`, userData);
    },
    // 주문 생성 요청
    createOrder(orderData) {
      return api.post('/orders/create', orderData);
    },

    // 주문 목록 가져오기 요청 (페이지 매개변수 포함)
    fetchOrderList(page = 0, size = 10) {
      return api.get(`/orders/all?page=${page}&size=${size}`);
    },

    // 특정 주문 조회 요청
    getOrderDetails(orderId) {
      return api.get(`/orders/${orderId}`);
    },

    // 주문 수정 요청
    updateOrder(orderId, updatedOrderData) {
      return api.patch(`/orders/${orderId}`, updatedOrderData);
    },

    // 주문 삭제 요청
    deleteOrder(orderId) {
      return api.delete(`/orders/${orderId}`);
    },

    // 제품 목록 가져오기
    getProducts() {
      return api.get('/products?sortBy=productType&direction=desc&page=0&size=10');
    },
    // 직원 목록 가져오기 요청
    fetchUserList(page = 0, size = 10) {
      return api.get(`/hr?page=${page}&size=${size}`);
    },    
    
};