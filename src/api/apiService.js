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
  fetchCustomerList2() {
    return api.get('/customer/all'); // 고객사 목록을 가져오는 API 엔드포인트 설정
  },
  // 고객사 목록 가져오기 요청
  fetchCustomerList(page = 0, size = 5) {
    return api.get(`/customer/all?page=${page}&size=${size}`); // 쿼리 파라미터로 페이지와 사이즈 전달
  },

  // 고객사 삭제 요청
  deleteCustomer(customerId) {
    return api.delete(`/customer/${customerId}`); // 고객사를 삭제하는 API 엔드포인트 설정
  },

  // 고객사 수정 요청
  updateCustomer(customerId, updatedData) {
    return api.patch(`/customer/${customerId}`, updatedData); // 고객사 정보를 수정하는 API 엔드포인트 설정
  },

  // 제품 리스트
  getProductList(page, size, sortBy, direction) {
    return api.get('/products', {
      params: {
        page,
        size,
        sortBy,
        direction,
      },
    });
  },

  // 제품 등록 요청
  createProduct(productData) {
    return api.post('/products/create', productData);
  },

  // 제품 삭제 요청
  deleteProduct(productId) {
    return api.delete(`/products/delete/${productId}`);
  },

  // 제품 수정 요청
  updateProduct(productId, updatedData) {
    return api.post(`/products/update/${productId}`, updatedData);
  },

  // 제품 검색 요청
  searchProducts(productName, page, size, sortBy, direction) {
    return api.get(`/products/search`, {
      params: {
        productName,
        page,
        size,
        sortBy,
        direction,
      },
    });
  },

  // 재고 리스트
  fetchInventoryList(page, size, sortBy, direction, searchTerm = '') {
    return api.get(`/inventory`, {
      params: {
        page,
        size,
        sortBy,
        direction,
        searchTerm,
      },
    });
  },
  // 입고
  createInbound(inboundData) {
    return api.post(`/inventory/inbound`, inboundData);
  },

  // 출고
  createOutbound(outboundData){
    return api.post(`/inventory/outbound`, outboundData);
  },

  // 소모
  createConsumption(consumptionData){
    return api.post(`/inventory/consumption`, consumptionData);
  },
  // 조정
  createAdjustment(adjustmentData){
    return api.post(`/inventory/adjustment`, adjustmentData);
  },
  
  // 재고 상세 보기
  getInventoriesByProductId(productId){
    return api.get(`/inventory/${productId}`);
  },

  // 재고 이력 리스트
  fetchInventoryHistoryList(page, size, sortBy, direction, searchQuery =''){
    return api.get(`/inventory/history`,{
      params: {
        page,
        size,
        sortBy,
        direction,
        searchQuery,
      },
    });
  },

  // 생산 리스트
  fetchProductionList(page, size, sortBy, sortDirection) {
    return api.get(`/production`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    });
  },

  // 생산
  createProduction(productionData) {
    return api.post(`/production/create`, productionData);
  },

  // 생산 완료
  submitProductionResult(productionId, resultData){
    return api.patch(`/production/update/${productionId}`, resultData);
  },

  // 생산 분석 등록
  submitProductionAnalysis(productionId, data) {
    return api.post(`/production/analysis/${productionId}`, data);
  },

  // 생산상세보기
  getProductionDetails(productionId) {
    return api.get(`/production/${productionId}`);
  },
  
  // 생산분석보기
  fetchProductionAnalysis(productionId, data) {
    return api.get(`/production/analysis/${productionId}`, data);
  },


  //고객사 세부 내역
  getCustomerDetails(customerId) {
    return api.get(`/customer/${customerId}`);
  },

    updateUser(userData) {
      return api.patch(`/hr/${userData.userIdx}`, userData);
    },
    checkInStatus() {
    return api.get('/attendance/status'); // 출근 여부 확인 API 엔드포인트
    }, 
    checkIn() {
      return api.post('/attendance');
    },
    checkOut() {
      return api.post('/attendance/leave-work');
    },
  
    // 주문 생성 요청
    createOrder(orderData) {
      return api.post('/orders/create', orderData);
    },
  // 여러 customerId에 대한 이름을 가져오는 함수
  fetchCustomerNames(customerIds) {
    return api.post('/customer/names', { customerIds });
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
    return api.post(`/hr/reset-pw`, { email, code, newPassword });
  },


  // 주문 목록 가져오기 요청 (페이지 매개변수 포함)
  fetchOrderList(page = 0, size = 10, searchQuery = "", sortOrder = "asc")  {
    return api.get('/orders/all', {
      params: {
        page,
        size,
        searchQuery, // 검색어 전달
        sort: sortOrder, // 정렬 순서 전달
      },
    });
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
  fetchUserList(page = 0, size = 5) {
    return api.get(`/hr?page=${page}&size=${size}`);
  },

};