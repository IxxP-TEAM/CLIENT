<template>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>생산할 제품</th>
            <th>시작 날짜</th>
            <th>종료 날짜</th>
            <th>목표 수량</th>
            <th>결과 수량</th>
            <th>생산 상태</th>
            <th>사용자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in productionItems" :key="item.productionId">
            <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td @click="() => { console.log('클릭된 item:', item); $emit('detail', item); }" style="cursor: pointer;">{{ item.productName }}</td>
            <td>{{ item.startDate }}</td>
            <td>{{ item.endDate }}</td>
            <td>{{ item.targetQuantity }}</td>
            <td>{{ item.resultQuantity }}</td>
            <td>
              <span :class="['status', item.productionStatus === '진행중' ? 'active' : 'inactive']">
                {{ item.productionStatus }}
              </span>
            </td> 
          
              
            <td>{{ item.userName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({// eslint-disable-line no-unused-vars
    productionItems: Array, // 생산 계획 항목 목록
    currentPage: Number,    // 현재 페이지
    itemsPerPage: Number,   // 페이지당 항목 수
  });
  </script>
  
  <style scoped>
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
  }
  
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  
  td {
    cursor: pointer;
  }
  
  .low-stock {
    color: red;
    font-weight: bold;
  }
  .status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
}

.status.active {
  background-color: #4caf50; 
}

.status.inactive {
  background-color: blue;
}
  </style>
  