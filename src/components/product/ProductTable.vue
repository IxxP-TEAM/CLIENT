<template>
  <table>
    <thead>
      <tr>
        <th>번호</th>
        <!-- 정렬된 상태일 때 헤더에 스타일 적용 -->
        <th @click="sortByColumn('name')" :class="{ sorted: sortedColumn === 'name' }" style="cursor: pointer;">
          제품 이름
        </th>
        <th @click="sortByColumn('type')" :class="{ sorted: sortedColumn === 'type' }" style="cursor: pointer;">
          제품 종류
        </th>
        <th>임계 재고 수량</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in displayedProducts" :key="product.productId">
        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
        <!-- 정렬된 상태일 때 제품 이름 열에만 스타일 적용 -->
        <td @click="$emit('update', product)" :class="{ sorted: sortedColumn === 'name' }" style="cursor: pointer;">
          {{ product.productName }}
        </td>
        <!-- 정렬된 상태일 때 제품 종류 열에만 스타일 적용 -->
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
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  products: Array,
  currentPage: Number,
  itemsPerPage: Number,
  isDeleteMode: Boolean,
});

const displayedProducts = ref([...props.products]); // 초기에는 원본 배열 유지
const isAscending = ref(true); // 정렬 방향 상태
const sortedColumn = ref(null); // 현재 정렬된 열

// 정렬 함수
function sortByColumn(column) {
  if (sortedColumn.value === column) {
    isAscending.value = !isAscending.value; // 동일한 열을 클릭하면 정렬 방향 변경
  } else {
    isAscending.value = true; // 새 열을 클릭하면 오름차순으로 초기화
    sortedColumn.value = column; // 정렬된 열 설정
  }

  displayedProducts.value = [...props.products].sort((a, b) => {
    if (column === 'name') {
      return isAscending.value
        ? a.productName.localeCompare(b.productName)
        : b.productName.localeCompare(a.productName);
    } else if (column === 'type') {
      return isAscending.value
        ? a.productType.localeCompare(b.productType)
        : b.productType.localeCompare(a.productType);
    }
    return 0;
  });
}

// props가 업데이트될 때 초기 상태로 복원
watch(
  () => props.products,
  (newProducts) => {
    displayedProducts.value = [...newProducts];
    sortedColumn.value = null; // 초기화 시 정렬 상태 해제
  }
);
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
}

/* 정렬된 상태일 때 해당 열의 색상 변경 */
.sorted {
  color: blue;
}
</style>
