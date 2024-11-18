<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>번호</th>
          <th>제품 이름</th>
          <th>변경 유형</th>
          <th>변경 수량</th>
          <th>변경 날짜</th>
          <th>사용자</th>
          <th>조정 사유</th>
          <th>유통기한</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in inventoryHistoryItems" :key="item.historyId">
          <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
          <td>{{ item.productName }}</td>
          <td>{{ item.changeType }}</td>
          <td>{{ item.changeQuantity }}</td>
          <td>{{ item.changeDate }}</td>
          <td>{{ item.userName }}</td>
          <td v-if="item.changeType === '조정'">{{ item.adjustment}}</td>
          <td v-else></td>
          <td v-if="item.changeType === '입고'">{{ item.expirationDate || 'N/A' }}</td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({// eslint-disable-line no-unused-vars
  inventoryHistoryItems: Array,
  currentPage: Number,
  itemsPerPage: Number
})
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
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

span {
  float: right;
}
</style>
