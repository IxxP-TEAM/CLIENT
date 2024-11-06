<!-- ProductTable.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th>번호</th>
        <!-- 열 헤더 클릭 시 상위 컴포넌트로 정렬 이벤트 전송 -->
        <th @click="$emit('sort', 'name')" :class="{ sorted: sortedColumn === 'name' }" style="cursor: pointer;">
          제품 이름
        </th>
        <th @click="$emit('sort', 'type')" :class="{ sorted: sortedColumn === 'type' }" style="cursor: pointer;">
          제품 종류
        </th>
        <th>임계 재고 수량</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="product.productId">
        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
        <td @click="$emit('update', product)" :class="{ sorted: sortedColumn === 'name' }" style="cursor: pointer;">
          {{ product.productName }}
        </td>
        <td :class="{ sorted: sortedColumn === 'type' }">{{ product.productType }}</td>
        <td>
          {{ product.safetyStockQuantity }}
          <button 
            v-if="isDeleteMode" 
            @click="$emit('delete', product)" 
            style="color: red; cursor: pointer; margin-left: 8px;">
            ✖
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({// eslint-disable-line no-unused-vars
  products: Array,
  currentPage: Number,
  itemsPerPage: Number,
  isDeleteMode: Boolean,
  sortedColumn: String,    // 정렬된 열 정보를 받아옴
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
  cursor: pointer;
}

/* 정렬된 상태일 때 해당 열의 색상 변경 */
.sorted {
  color: blue;
}
</style>
