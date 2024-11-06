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

    // 제품 목록 조회 요청
  getProductList() {
    return api.get('/products');
  },

  // 제품 등록 요청
  createProduct(productData) {
    return api.post('/products/create', productData);
  },

  // 제품 삭제 요청
  deleteProduct(productId) {
    return api.delete(`/products/delete/${productId}`);
  },

  // 제품 검색 요청
  searchProducts(name) {
    return api.get(`/products/search`, {
      params: { name },
    });
  },

  // 제품 수정 요청
  updateProduct(productId, updatedData) {
    return api.post(`/products/update/${productId}`, updatedData);
  },
    
};
