import api from './api';

export default {
  // 회원가입 요청
  registerUser(userData) {
    return api.post('/admin/join', userData);
  },

    // 고객사 등록 요청
    createCustomer(customerData) {
      return api.post('/customer/create', customerData);
    },
    
};