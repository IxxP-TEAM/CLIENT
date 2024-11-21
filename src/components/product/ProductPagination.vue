<!-- src/components/inventoryPagination.vue -->
<template>
  <div class="pagination">
    <button @click="$emit('go-to-page', 1)" :disabled="currentPage === 1">처음 페이지 이동</button>
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
    <button @click="$emit('go-to-page', totalPages)" :disabled="currentPage === totalPages">마지막 페이지 이동</button>
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
const start = Math.max(1, props.currentPage - 2)
const end = Math.min(props.totalPages, start + 4)

for (let i = start; i <= end; i++) {
  pages.push(i)
}

return pages
})
</script>

<style scoped>
.pagination {
  /* margin-top: 16px; */
  display: flex;
  justify-content: center;
  /* gap: 8px; */
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
}
.pagination span {
margin: 0 5px;
cursor: pointer;
}

.pagination .active {
  font-weight: bold;
  color: #3f72af;
  /* background-color: #007bff; */
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
.pagination-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  background-color: #ffffff;
  color: #3f72af;
  transition: background-color 0.3s, transform 0.2s;
}
</style>
