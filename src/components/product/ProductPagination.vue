<!-- src/components/ProductPagination.vue -->
<template>
    <div class="pagination">
      <button @click="$emit('go-to-page', currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
      <span
        v-for="page in totalPages"
        :key="page"
        @click="$emit('go-to-page', page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </span>
      <button @click="$emit('go-to-page', currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({// eslint-disable-line no-unused-vars
    currentPage: Number,
    totalPages: Number,
  })
  </script>
  
  <style scoped>
  .pagination {
    /* margin-top: 16px; */
    display: flex;
    justify-content: center;
    /* gap: 8px; */
  }
  
  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 14px;
  }
  .pagination span {
  margin: 0 5px;
  cursor: pointer;
}
  
  .pagination .active {
    font-weight: bold;
    color: #3f72af;
    /* background-color: #007bff; */
  }
  </style>
  