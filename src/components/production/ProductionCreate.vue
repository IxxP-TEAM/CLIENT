<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">생산 등록</h3>
      <form @submit.prevent="submitProduction" class="modal-form">
        <!-- 생산할 제품 -->
        <label for="productName">생산할 제품</label>
        <input
          type="text"
          id="productName"
          v-model="productionData.productName"
          @click="openProductSelector()"
          readonly
          required
        />

        <!-- 목표 수량 -->
        <label for="targetQuantity">목표 수량</label>
        <input
          type="number"
          id="targetQuantity"
          v-model="productionData.targetQuantity"
          required
          min="1"
        />

        <!-- 시작 날짜 -->
        <label for="startDate">시작 날짜</label>
        <input
          type="date"
          id="startDate"
          v-model="productionData.startDate"
          :min="today"
          required
        />

        <!-- 종료 날짜 -->
        <label for="endDate">종료 날짜</label>
        <input
          type="date"
          id="endDate"
          v-model="productionData.endDate"
          :min="productionData.startDate"
          required
        />

        <!-- 원재료 목록 -->
        <div>
          <h4>원재료</h4>
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
            <button type="button" @click="removeMaterial(index)" class="button-a"
            style="height: 40px; line-height: 40px; padding: 0 15px;"
            >
              삭제
            </button>
          </div>
          <button type="button" @click="addMaterial">+ 원재료 추가</button>
        </div>

        <div v-if="computedErrorMessage" class="error">{{ computedErrorMessage }}</div>

        <div class="button-group">
          <button type="submit">등록</button>
          <button class="button-a" @click="$emit('close')" type="button">닫기</button>
        </div>
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
import { ref, defineProps, defineEmits, computed } from "vue";
import apiService from "@/api/apiService";
import InventoryProductSelector from "@/components/inventory/InventoryProductSelector.vue";

// 오늘 날짜
const today = new Date().toISOString().split("T")[0];

// Props
const props = defineProps({
  isOpen: Boolean,
  errorMessage: String,
});
const computedErrorMessage = computed(() => props.errorMessage);

// Emits
const emit = defineEmits(["close", "refresh"]);

// 데이터
const productionData = ref({
  productName: "", // 생산 제품 이름
  startDate: "", // 시작 날짜
  endDate: "", // 종료 날짜
  targetQuantity: null, // 목표 수량
  productionStatus: "진행중", // 기본값
  materials: [
    {
      productMaterialName: "",
      materialQuantity: null,
    },
  ], // 원재료 리스트
});

// 모달 상태
const showProductSelector = ref(false); // 제품 선택 모달 상태
const productOptions = ref([]); // 제품 옵션 데이터
const selectedMaterialIndex = ref(null); // 선택된 원재료 필드 인덱스

// 제품 선택 모달 닫기
const closeProductSelector = () => {
  showProductSelector.value = false;
};

// 제품 선택
const selectProduct = (product) => {
  if (selectedMaterialIndex.value !== null) {
    // 원재료 필드에 반영
    productionData.value.materials[selectedMaterialIndex.value].productMaterialName =
      product.productName;
    selectedMaterialIndex.value = null; // 초기화
  } else {
    // 생산 제품 이름에 반영
    productionData.value.productName = product.productName;
  }
  closeProductSelector(); // 모달 닫기
};

// 원재료 추가
const addMaterial = () => {
  productionData.value.materials.push({
    productMaterialName: "",
    materialQuantity: null,
  });
};

// 원재료 삭제
const removeMaterial = (index) => {
  productionData.value.materials.splice(index, 1);
};

// 생산 등록 요청
const submitProduction = async () => {
  try {
    await apiService.createProduction(productionData.value);
    emit("refresh"); // 성공 후 리스트 갱신 요청
    emit("close"); // 모달 닫기
  } catch (error) {
    console.error("생산 등록 중 오류 발생:", error);
    emit(
      "error",
      error.response?.data?.message || "생산 등록 중 오류가 발생했습니다."
    );
  }
};

// 제품 선택 모달 열기
const openProductSelector = async () => {
  await fetchProducts(); // 제품 목록 불러오기
  selectedMaterialIndex.value = null; // 전체 제품 선택 시 초기화
  showProductSelector.value = true; // 모달 열기
};

// 원재료 선택 모달 열기
const openMaterialSelector = async (index) => {
  await fetchProducts(); // 원재료 목록 불러오기
  selectedMaterialIndex.value = index; // 선택된 원재료 필드 인덱스 설정
  showProductSelector.value = true; // 모달 열기
};

// 제품 목록 불러오기
const fetchProducts = async () => {
  try {
    const response = await apiService.getProductList();
    productOptions.value = response.data.data; // 제품 목록 설정
  } catch (error) {
    console.error("제품 목록 불러오기 중 오류 발생:", error);
  }
};
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
input[type="text"],
input[type="number"],
input[type="date"] {
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
</style>
