<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>{{ productName }} - 상세 재고 보기</h3>
      
      <!-- 데이터가 있는 경우 최대 10개 항목을 보여주고 나머지는 스크롤 -->
      <ul v-if="limitedInventoryDetails.length > 0" class="inventory-list">
        <li v-for="(item, index) in limitedInventoryDetails" :key="index"
        @click="selectExpiration(item)" 
          style="cursor: pointer;">
          유통기한: {{ item.expirationDate }} | 재고 수량: {{ item.currentQuantity }}
        </li>
      </ul>
      
      <!-- 데이터가 없을 경우 메시지 표시 -->
      <p v-else>재고 정보가 없습니다.</p>
      
      <button class="jump-button" @click="closeModal" style="background-color: red; color: white; float: right;">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  inventoryDetails: Array,
  productName: String,
  isOpen: Boolean,
})

const emit = defineEmits(['close','select-expiration'])

// 처음 10개 항목만 반환하는 계산 속성
const limitedInventoryDetails = computed(() => props.inventoryDetails)

function closeModal() {
  emit('close')
}

function selectExpiration(item) {
  emit("select-expiration", item.expirationDate); // 유통기한 전달
}
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 800px; /* 가로 너비 */
  max-width: 95%;
}

.inventory-list {
  max-height: 200px; /* 내부 리스트의 높이 제한 */
  overflow-y: auto; /* 스크롤 활성화 */
  padding: 0;
  margin: 0;
  list-style-type: none;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #3f72af;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.jump-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #3f72af;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition:
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}
</style>
