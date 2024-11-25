<!-- src/components/ProductDelete.vue -->
<template>
    <div class="modal-overlay">
      <div class="modal-content">
        <p>정말로 {{ productName }}을(를) 삭제하시겠습니까?</p>
        <div v-if="computedErrorMessage" class="error">{{ computedErrorMessage }}</div>
        <div class="button-group">
        <button class="button-a" @click="$emit('confirm')">삭제</button>
        <button @click="$emit('close')">취소</button>
      </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue'

  const computedErrorMessage = computed(() => props.errorMessage);
  
  const props = defineProps({
    productName: String,
    errorMessage: String
  })
  </script>
  
  <style scoped>
  .modal-overlay {
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
  .button-group {
    display: flex;
    justify-content: flex-end; 
    gap: 10px; 
    margin-top: 20px;
  }
  .button-a{
  padding: 10px 20px;
  font-size: 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  }
  button{
    padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  }
  .error {
    color: red;
    font-size: 14px;
    margin-top: 10px;
  }
  </style>
  