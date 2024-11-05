<!-- src/components/ProductDelete.vue -->
<template>
    <div class="modal">
      <div class="modal-content">
        <p>정말로 {{ productName }}을(를) 삭제하시겠습니까?</p>
        <button @click="$emit('confirm')">삭제</button>
        <button @click="$emit('close')">취소</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({// eslint-disable-line no-unused-vars
    productName: String,
  })
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  </style>
  