<template>
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">생산 결과 입력</h3>
        <form @submit.prevent="submitProductionResult" class="modal-form">
          <fieldset class="section">
          <legend><i class="fas fa-building"></i> 기본 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
          <label for="productionName">생산 계획</label>
          </div>
          <input
            type="text"
            id="productionName"
            v-model="resultData.productionName"
            @click="openProductionSelector"
            readonly
            required
          /></div>
          <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
          <label for="resultQuantity">생산 결과 수량</label>
          </div>
          <input
            type="number"
            id="resultQuantity"
            v-model="resultData.resultQuantity"
            required
            min="1"
          /></div>
          <div class="error-container">
          <div v-if="computedErrorMessage" class="error">{{ computedErrorMessage }}</div>
        </div>
          <div class="button-group">
            <button class="jump-button" type="submit">등록</button>
            <button class="jump-button" @click="$emit('close')" type="button" style="background-color: gray; color: white; float: right;">닫기</button>
          </div>
          </div>
          </fieldset>
        </form>
  
        <ProductionSelector
          v-if="showProductionSelector"
          :productionOptions="productionOptions"
          @confirm-selection="selectProduction"
          @close="closeProductionSelector"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import ProductionSelector from "@/components/production/ProductionSelector.vue";
  import apiService from "@/api/apiService";
  

  const props = defineProps({
  filteredProductions: {
    type: Array,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
    },
    errorMessage: String,
});
  
  const emit = defineEmits(["close", "refresh"]);
  
  // 데이터
  const resultData = ref({
    productionId: null, // 선택된 생산 ID
    productionName: "", // 생산 계획 이름
    resultQuantity: null, // 생산 결과 수량
  });
  
  // 상태 관리
  const showProductionSelector = ref(false); // 생산 선택 모달 상태
  const productionOptions = ref([]); // 생산 계획 옵션 데이터
  
  // 에러 메시지
  const computedErrorMessage = computed(() => props.errorMessage);
  
  // 생산 결과 등록 요청
const submitProductionResult = async () => {
    if (!resultData.value.productionId || !resultData.value.resultQuantity) {
        console.error("필수 데이터가 누락되었습니다.");
        return;
    }
    try {
      await apiService.submitProductionResult(resultData.value.productionId, {
            resultQuantity: resultData.value.resultQuantity // 결과 수량 전달
        });
      emit("refresh"); // 성공 후 리스트 갱신 요청
      emit("close"); // 모달 닫기
    } catch (error) {
      console.error("생산 결과 등록 중 오류 발생:", error);
      emit(
        "error",
        error.response?.data?.message || "생산 결과 등록 중 오류가 발생했습니다."
      );
    }
  };
  
  // 생산 선택 모달 열기
  const openProductionSelector = async () => {
    await fetchProductionList(); // 생산 목록 불러오기
    showProductionSelector.value = true; // 모달 열기
  };
  
  // 생산 목록 불러오기
  const fetchProductionList = async () => {
    try {
      const response = await apiService.fetchProductionList(0, 1000); // 충분히 큰 데이터 가져오기
      productionOptions.value = response.data.data.elements; // 생산 계획 옵션 설정
    } catch (error) {
      console.error("생산 목록을 불러오는 중 오류가 발생했습니다:", error);
    }
  };
  
  // 생산 선택 모달 닫기
  const closeProductionSelector = () => {
    showProductionSelector.value = false;
  };
  
  // 선택한 생산 계획 처리
  const selectProduction = (production) => {
    resultData.value.productionId = production.productionId;
    resultData.value.productionName = production.productName; // 생산 계획 이름 설정
    closeProductionSelector();
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
  min-height: 20px; 
  margin-bottom: 10px; 
}
.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  
}
  </style>
  