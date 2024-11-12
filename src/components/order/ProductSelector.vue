<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <h2>제품 선택</h2>
        <input v-model="searchTerm" @input="filterProducts" placeholder="제품 검색" class="search-bar" />
        <table class="product-table">
          <thead>
            <tr>
              <th>선택</th>
              <th>제품명</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.productId">
              <td><input type="checkbox" :value="product" v-model="selectedProducts" /></td>
              <td>{{ product.productName }}</td>
              <td>₩{{ product.productPrice.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="previousPage" :disabled="currentPage === 0">이전</button>
          <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages - 1">다음</button>
        </div>
        <div class="button-group">
          <button @click="confirmSelection" class="confirm-btn">선택 완료</button>
          <button @click="close" class="cancel-btn">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      productOptions: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        selectedProducts: [],
        searchTerm: '',
        filteredProducts: this.productOptions,
        currentPage: 0,
        pageSize: 5,
      };
    },
    computed: {
      paginatedProducts() {
        const start = this.currentPage * this.pageSize;
        return this.filteredProducts.slice(start, start + this.pageSize);
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.pageSize);
      },
    },
    watch: {
      productOptions: {
        immediate: true,
        handler(newOptions) {
          this.filteredProducts = newOptions;
        },
      },
    },
    methods: {
      filterProducts() {
        const term = this.searchTerm.toLowerCase();
        this.filteredProducts = this.productOptions.filter(product =>
          product.productName.toLowerCase().includes(term)
        );
        this.currentPage = 0; // 검색 시 첫 페이지로 이동
      },
      confirmSelection() {
        this.$emit('confirm-selection', this.selectedProducts);
        this.close();
      },
      close() {
        this.$emit('close');
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) {
          this.currentPage++;
        }
      },
      previousPage() {
        if (this.currentPage > 0) {
          this.currentPage--;
        }
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
    width: 600px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  /* 스크롤바 숨기기 */
  .modal-content::-webkit-scrollbar {
    display: none;
  }
  
  .modal-content {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  
  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #3f72af;
  }
  
  .search-bar {
    padding: 10px;
    margin-bottom: 15px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
  }
  
  .product-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .product-table th, .product-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
  }
  
  .product-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  
  .product-table tr:hover {
    background-color: #f9f9f9;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
  }
  
  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .confirm-btn {
    background-color: #3f72af;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .confirm-btn:hover {
    background-color: #2c5987;
  }
  
  .cancel-btn {
    background-color: #d9534f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background-color: #c9302c;
  }
  </style>
  