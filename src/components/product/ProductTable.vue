<!-- ProductTable.vue -->
<template>
  <div class="table-container">
  <table>
    <thead>
      <tr>
        <th>번호</th>
        <th>제품 이름</th>
        <th>제품 종류</th>
        <th>제품 가격</th>
        <th>임계 재고 수량</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="product.productId">
        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
        <td @click="$emit('update', product)" style="cursor: pointer;">
          {{ product.productName }}
        </td>
        <td>{{ product.productType }}</td>
        <td>{{ product.productPrice }}</td>
        <td>
          {{ product.safetyStockQuantity }}
          <span 
            v-if="isDeleteMode" 
            @click="$emit('delete', product)" 
            style="color: red; cursor: pointer; margin-left: 8px;">
            ✖
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({// eslint-disable-line no-unused-vars
  products: Array,
  currentPage: Number,
  itemsPerPage: Number,
  isDeleteMode: Boolean,
})
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

span {
  float: right;
}

</style>
