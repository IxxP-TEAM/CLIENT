<!-- src/components/inventoryPagination.vue -->
<template>
  <div class="pagination">
    <!-- <button @click="$emit('go-to-page', 1)" :disabled="currentPage === 1">처음 페이지 이동</button> -->
    <button @click="$emit('go-to-page', currentPage - 1)" :disabled="currentPage === 1" class="pagination-arrow">&lt;</button>
    <span
    v-for="page in visiblePages"
    :key="page"
    @click="$emit('go-to-page', page)"
    :class="{ active: currentPage === page }"
    class="pagination-page"
  >
      {{ page }}
    </span>
    <button @click="$emit('go-to-page', currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-arrow">&gt;</button>
    <!-- <button @click="$emit('go-to-page', totalPages)" :disabled="currentPage === totalPages">마지막 페이지 이동</button> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
})

const visiblePages = computed(() => {
const pages = []
const start = Math.max(1, props.currentPage - 4)
const end = Math.min(props.totalPages, start + 9)

for (let i = start; i <= end; i++) {
  pages.push(i)
}

return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination-page {
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: #000000;
  transition: color 0.3s ease;
}

.pagination-page:hover {
  color: #1d4f7a;
}

.pagination-page.active {
  color: #3f72af;
  font-weight: bold;
  text-decoration: underline;
}

.pagination-arrow {
  font-size: 18px;
  font-weight: bold;
  color: #3f72af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s ease, transform 0.2s ease;
}

.pagination-arrow:hover {
  color: #434190; /* 호버 시 색상 변화 */
  transform: translateY(-2px); /* 살짝 떠오르는 효과 */
}

.pagination-arrow:disabled {
  color: #b0b0b0; /* 비활성화 시 색상 */
  cursor: not-allowed;
  transform: none;
}

</style>
