<!-- ProductTable.vue -->
<template>
    <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제품 이름</th>
          <th>제품 종류</th>
          <th>제품 수량</th>
          <th>임계 재고 수량</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in inventoryItems" :key="item.productId">
          <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
          <td @click="() => { console.log('클릭된 item:', item); $emit('detail', item); }" style="cursor: pointer;">{{ item.productName }}</td>
          <td>{{ item.productType }}</td>
          <td :class="{ 'low-stock': item.totalQuantity <= item.safetyStockQuantity }">
            {{ item.totalQuantity }}
          </td>
          <td>
            {{ item.safetyStockQuantity }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </template>
  
  <script setup>
import { defineProps } from 'vue';

const props = defineProps({// eslint-disable-line no-unused-vars
  inventoryItems: Array,     // InventoryListDto의 목록
  currentPage: Number,       // 현재 페이지
  itemsPerPage: Number,      // 페이지당 항목 수
});
</script>
  
  <style scoped>
  
  .table-container {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    /* margin-bottom: 20px; */
  }
  
  th, td {
    /* border: 1px solid #ddd;
    padding: 8px; */
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
  }
  
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .low-stock {
  color: red; /* 재고 수량이 임계 수량 이하일 때 빨간색으로 표시 */
}
  
  </style>
  