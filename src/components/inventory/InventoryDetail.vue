<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3 class="modal-title">{{ productName }} - 상세 재고 보기</h3>

      <div class="info-section">
        <h4 class="section-title">재고 목록</h4>

        <ul v-if="limitedInventoryDetails.length > 0" class="inventory-list">
          <li
            v-for="(item, index) in limitedInventoryDetails"
            :key="index"
            class="inventory-item"
            @click="selectExpiration(item)"
          >
            <span class="inventory-label">유통기한:</span>
            <span class="inventory-value">{{ item.expirationDate }}</span> |
            <span class="inventory-label">재고 수량:</span>
            <span class="inventory-value">{{ item.currentQuantity }}</span>
          </li>
        </ul>

        <p v-else class="no-data">재고 정보가 없습니다.</p>
      </div>

      <div class="button-group">
        <button
          class="jump-button"
          @click="closeModal"
          style="background-color: gray"
        >
          닫기
        </button>
      </div>
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

const emit = defineEmits(['close', 'select-expiration'])

// 재고 데이터를 계산하여 반환
const limitedInventoryDetails = computed(() =>
  props.inventoryDetails.slice(0, 10),
)

function closeModal() {
  emit('close')
}

function selectExpiration(item) {
  emit('select-expiration', item.expirationDate) // 유통기한 데이터 전달
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
  border-radius: 12px;
  width: 800px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #3f72af;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.info-section {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #3f72af;
  margin-bottom: 15px;
}

.inventory-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.inventory-item {
  font-size: 16px;
  color: #555;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background: white;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.inventory-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.inventory-label {
  font-weight: bold;
  color: #3f72af;
}

.inventory-value {
  color: #333;
}

.no-data {
  color: #777;
  font-size: 16px;
  text-align: center;
  padding: 10px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
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
    background-color 0.3s ease,
    transform 0.2s ease;
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-3px);
}

.jump-button:active {
  transform: translateY(2px);
}

.close-button {
  background-color: red;
  color: white;
}

.close-button:hover {
  background-color: #b22222;
}
</style>
