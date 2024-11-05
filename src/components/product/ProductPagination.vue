<!-- src/components/ProductPagination.vue -->
<template>
    <div class="pagination">
      <button @click="$emit('go-to-page', currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="$emit('go-to-page', page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="$emit('go-to-page', currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
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
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  .pagination button {
    padding: 4px 8px;
  }
  
  .pagination .active {
    font-weight: bold;
    color: white;
    background-color: #007bff;
  }
  </style>
  