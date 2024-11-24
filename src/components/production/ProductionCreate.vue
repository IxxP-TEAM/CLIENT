<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">생산 등록</h3>
      <form @submit.prevent="submitProduction" class="modal-form">
        <fieldset class="section">
          <legend><i class="fas fa-building"></i> 기본 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <!-- 생산할 제품 -->
                <label for="productName">생산할 제품</label>
              </div>
              <input
                type="text"
                id="productName"
                v-model="productionData.productName"
                @click="openProductSelector()"
                readonly
                required
              />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <!-- 목표 수량 -->
                <label for="targetQuantity">목표 수량</label>
              </div>
              <input
                type="number"
                id="targetQuantity"
                v-model="productionData.targetQuantity"
                required
                min="1"
              />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <!-- 시작 날짜 -->
                <label for="startDate">시작 날짜</label>
              </div>
              <input
                type="date"
                id="startDate"
                v-model="productionData.startDate"
                :min="today"
                required
              />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <!-- 종료 날짜 -->
                <label for="endDate">종료 날짜</label>
              </div>
              <input
                type="date"
                id="endDate"
                v-model="productionData.endDate"
                :min="productionData.startDate"
                required
              />
            </div>
          </div>
          <br>
          <!-- 원재료 목록 -->
          <div
            v-for="(material, index) in productionData.materials"
            :key="index"
            class="material-group"
          >
            
            <label for="productMaterialName">원재료 이름</label>

            <input
              type="text"
              v-model="material.productMaterialName"
              @click="openMaterialSelector(index)"
              readonly
              required
            />

            <label for="materialQuantity">수량</label>

            <input
              type="number"
              v-model="material.materialQuantity"
              required
              min="1"
            />
            <button
              type="button"
              @click="removeMaterial(index)"
              class="jump-button"
              style="
                height: 40px;
                line-height: 40px;
                padding: 0 15px;
                background-color: red;
                color: white;
              "
            >
              삭제
            </button>
          </div>
          <button type="button" @click="addMaterial" class="jump-button">
            + 원재료 추가
          </button>

          <div v-if="computedErrorMessage" class="error">
            {{ computedErrorMessage }}
          </div>

          <div class="button-group">
            <button class="jump-button" type="submit">등록</button>
            <button
              class="jump-button"
              @click="$emit('close')"
              type="button"
              style="background-color: gray; color: white; float: right"
            >
              닫기
            </button>
          </div>
        </fieldset>
      </form>

      <!-- 제품 선택 모달 -->
      <InventoryProductSelector
        v-if="showProductSelector"
        :productOptions="productOptions"
        @confirm-selection="selectProduct"
        @close="closeProductSelector"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import apiService from '@/api/apiService'
import InventoryProductSelector from '@/components/inventory/InventoryProductSelector.vue'

// 오늘 날짜
const today = new Date().toISOString().split('T')[0]

// Props
const props = defineProps({
  isOpen: Boolean,
  errorMessage: String,
})
const computedErrorMessage = computed(() => props.errorMessage)

// Emits
const emit = defineEmits(['close', 'refresh'])

// 데이터
const productionData = ref({
  productName: '', // 생산 제품 이름
  startDate: '', // 시작 날짜
  endDate: '', // 종료 날짜
  targetQuantity: null, // 목표 수량
  productionStatus: '진행중', // 기본값
  materials: [
    {
      productMaterialName: '',
      materialQuantity: null,
    },
  ], // 원재료 리스트
})

// 모달 상태
const showProductSelector = ref(false) // 제품 선택 모달 상태
const productOptions = ref([]) // 제품 옵션 데이터
const selectedMaterialIndex = ref(null) // 선택된 원재료 필드 인덱스

// 제품 선택 모달 닫기
const closeProductSelector = () => {
  showProductSelector.value = false
}

// 제품 선택
const selectProduct = product => {
  if (selectedMaterialIndex.value !== null) {
    // 원재료 필드에 반영
    productionData.value.materials[
      selectedMaterialIndex.value
    ].productMaterialName = product.productName
    selectedMaterialIndex.value = null // 초기화
  } else {
    // 생산 제품 이름에 반영
    productionData.value.productName = product.productName
  }
  closeProductSelector() // 모달 닫기
}

// 원재료 추가
const addMaterial = () => {
  productionData.value.materials.push({
    productMaterialName: '',
    materialQuantity: null,
  })
}

// 원재료 삭제
const removeMaterial = index => {
  productionData.value.materials.splice(index, 1)
}

// 생산 등록 요청
const submitProduction = async () => {
  try {
    await apiService.createProduction(productionData.value)
    emit('refresh') // 성공 후 리스트 갱신 요청
    emit('close') // 모달 닫기
  } catch (error) {
    console.error('생산 등록 중 오류 발생:', error)
    emit(
      'error',
      error.response?.data?.message || '생산 등록 중 오류가 발생했습니다.',
    )
  }
}

// 제품 선택 모달 열기
const openProductSelector = async () => {
  await fetchProducts() // 제품 목록 불러오기
  selectedMaterialIndex.value = null // 전체 제품 선택 시 초기화
  showProductSelector.value = true // 모달 열기
}

// 원재료 선택 모달 열기
const openMaterialSelector = async index => {
  await fetchProducts() // 원재료 목록 불러오기
  selectedMaterialIndex.value = index // 선택된 원재료 필드 인덱스 설정
  showProductSelector.value = true // 모달 열기
}

// 제품 목록 불러오기
const fetchProducts = async () => {
  try {
    const response = await apiService.getProductList()
    productOptions.value = response.data.data // 제품 목록 설정
  } catch (error) {
    console.error('제품 목록 불러오기 중 오류 발생:', error)
  }
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
.modal-title {
  margin-bottom: 20px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 800px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-form {
  display: flex;
  flex-direction: column;
}
label {
  margin-top: 10px;
  font-weight: bold;
}
input[type='text'],
input[type='number'],
input[type='date'] {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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
.button-a {
  padding: 10px 20px;
  font-size: 16px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
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
  transition:;
}

.jump-button:hover {
  background-color: #434190;
  transform: translateY(-5px);
}

.jump-button:active {
  transform: translateY(2px);
}
.section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f7faff;
}

.section legend {
  font-size: 18px;
  font-weight: bold;
  color: #0066cc;
}

.form-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 16px;
  color: #666;
}
.error-container {
  min-height: 20px; /* 에러 메시지 공간 유지 */
  margin-bottom: 10px; /* 버튼 그룹과 간격 유지 */
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
