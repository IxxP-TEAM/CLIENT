import api from './api';

export default {
  // 회원가입 요청
  registerUser(userData) {
    return api.post('/admin/join', userData);
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
