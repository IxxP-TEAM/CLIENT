<!-- ConfirmModal.vue -->
<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <h2>확인</h2>
        <p>{{ message }}</p>
        <div class="button-group">
          <button @click="confirm">확인</button>
          <button @click="close">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        default: '정말로 삭제하시겠습니까?',
      },
    },
    methods: {
      confirm() {
        this.$emit('confirm');
        this.close();
      },
      close() {
        this.$emit('close');
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
    width: 400px;
    max-width: 90%;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .button-group {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  button {
    padding: 10px 50px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:first-of-type {
    background-color: #f44336;
    color: white;
  }
  
  button:last-of-type {
    background-color: #3F72AF;
    color: white;
  }
  
  button:hover {
    opacity: 0.9;
  }
  </style>
  