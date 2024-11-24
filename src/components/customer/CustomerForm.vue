<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2 class="modal-title">
        {{ isEditMode ? '고객사 수정' : '고객사 등록' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="form">
        <!-- 기본 정보 섹션 -->
        <fieldset class="section">
          <legend><i class="fas fa-building"></i> 기본 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user-circle icon"></i>
                <label for="customerName">고객사 이름 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerName"
                type="text"
                id="customerName"
                required
              />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-phone icon"></i>
                <label for="customerPhone">고객사 전화번호 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerPhone"
                type="text"
                id="customerPhone"
                @input="formatCustomerPhone"
                :class="{
                  invalid: !isCustomerPhoneValid && formData.customerPhone,
                }"
                required
              />
              <small
                v-if="!isCustomerPhoneValid && formData.customerPhone"
                class="error-message"
              >
                유효한 전화번호 형식이 아닙니다.
              </small>
            </div>
          </div>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-map-marker-alt icon"></i>
                <label for="customerAddress">고객사 주소 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerAddress"
                type="text"
                id="customerAddress"
                required
              />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-map-pin icon"></i>
                <label for="customerAdddetail">고객사 상세주소 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerAdddetail"
                type="text"
                id="customerAdddetail"
                required
              />
            </div>
          </div>
        </fieldset>

        <!-- 담당자 정보 섹션 -->
        <fieldset class="section">
          <legend><i class="fas fa-user-tie"></i> 담당자 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-user icon"></i>
                <label for="customerPersonName">담당자 이름 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerPersonName"
                type="text"
                id="customerPersonName"
                required
              />
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-mobile-alt icon"></i>
                <label for="customerPersonPhone">담당자 전화번호 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerPersonPhone"
                type="text"
                id="customerPersonPhone"
                @input="formatCustomerPersonPhone"
                :class="{
                  invalid:
                    !isCustomerPersonPhoneValid && formData.customerPersonPhone,
                }"
                required
              />
              <small
                v-if="
                  !isCustomerPersonPhoneValid && formData.customerPersonPhone
                "
                class="error-message"
              >
                유효한 전화번호 형식이 아닙니다.
              </small>
            </div>
          </div>
          <div class="form-group">
            <div class="input-field full-width">
              <div class="field-label">
                <i class="fas fa-envelope icon"></i>
                <label for="customerPersonEmail">담당자 이메일 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerPersonEmail"
                type="email"
                id="customerPersonEmail"
                required
              />
            </div>
          </div>
        </fieldset>

        <!-- 기타 정보 섹션 -->
        <fieldset class="section">
          <legend><i class="fas fa-info-circle"></i> 기타 정보</legend>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-id-card icon"></i>
                <label for="registrationNumber">사업자등록번호 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.registrationNumber"
                type="text"
                id="registrationNumber"
                @input="checkRegistrationNumber"
                :class="{ invalid: isDuplicateRegistrationNumber }"
                required
              />
              <small v-if="isDuplicateRegistrationNumber" class="error-message">
                이미 등록된 사업자등록번호입니다.
              </small>
            </div>
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-chart-line icon"></i>
                <label for="customerStatus">고객사 상태 <span class="required">*</span></label>
              </div>
              <select
                v-model="formData.customerStatus"
                id="customerStatus"
                required
              >
                <option value="거래중">거래중</option>
                <option value="거래중지">거래중지</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="input-field">
              <div class="field-label">
                <i class="fas fa-calendar-alt icon"></i>
                <label for="customerSdate">고객사 시작일 <span class="required">*</span></label>
              </div>
              <input
                v-model="formData.customerSdate"
                type="date"
                id="customerSdate"
                required
              />
              <small v-if="!isCustomerSdateValid" class="error-message">
                현재 날짜를 초과할 수 없습니다.
              </small>
            </div>
            <div class="input-field full-width">
              <div class="field-label">
                <i class="fas fa-sticky-note icon"></i>
                <label for="customerNote">메모</label>
              </div>
              <textarea
                v-model="formData.customerNote"
                id="customerNote"
                rows="3"
              ></textarea>
            </div>
          </div>
        </fieldset>

        <!-- 버튼 -->
        <div class="button-group">
          <button type="submit">{{ isEditMode ? '수정' : '등록' }}</button>
          <button type="button" @click="close">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import apiService from '@/api/apiService'
import VueJwtDecode from 'vue-jwt-decode'

export default {
  props: {
    customerData: {
      type: Object,
      default: () => ({}),
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isCustomerPhoneValid() {
      return this.validatePhoneNumber(this.formData.customerPhone)
    },
    isCustomerPersonPhoneValid() {
      return this.validatePersonPhoneNumber(this.formData.customerPersonPhone)
    },
    isCustomerSdateValid() {
      const today = new Date().toISOString().split('T')[0] // 현재 날짜
      return (
        !this.formData.customerSdate || this.formData.customerSdate <= today
      )
    },
  },
  data() {
    return {
      formData: {},
      message: '',
      isDuplicateRegistrationNumber: false, // 중복 여부 상태 추가
    }
  },
  mounted() {
    this.getUserNameFromToken() // 로그인한 사용자 이름 가져오기
    if (this.isEditMode) {
      this.formData = { ...this.customerData }
    } else {
      this.resetFormData()
    }
  },
  methods: {
    // 사업자등록번호 중복 확인 메서드
    async checkRegistrationNumber() {
      if (!this.formData.registrationNumber) return

      try {
        const response = await apiService.checkDuplicateRegistrationNumber(
          this.formData.registrationNumber
        )
        this.isDuplicateRegistrationNumber = response.data.isDuplicate // 서버 응답에 따라 중복 여부 설정
      } catch (error) {
        console.error('사업자등록번호 중복 확인 오류:', error)
        this.isDuplicateRegistrationNumber = false
      }
    },
    async handleSubmit() {
      if (this.isDuplicateRegistrationNumber) {
        this.message = '사업자등록번호가 중복되었습니다.'
        return
      }
      if (!this.isCustomerPhoneValid || !this.isCustomerPersonPhoneValid) {
        this.message = '전화번호 형식이 유효하지 않습니다.'
        return
      }
      if (!this.isCustomerSdateValid) {
        this.message = '고객사 시작일은 현재 날짜를 넘을 수 없습니다.'
        return
      }
      try {
        this.formData.userName = this.selectedEmployeeName
        if (this.isEditMode) {
          await apiService.updateCustomer(
            this.formData.customerId,
            this.formData
          )
          this.message = '수정 성공'
        } else {
          await apiService.createCustomer(this.formData)
          this.message = '등록 성공'
        }
        this.$emit('registered')
        this.close()
      } catch (error) {
        console.error('오류:', error)
        this.message = this.isEditMode ? '수정 실패' : '등록 실패'
      }
    },
    formatCustomerPhone() {
      this.formData.customerPhone = this.formatPhoneNumber(
        this.formData.customerPhone
      )
    },
    formatCustomerPersonPhone() {
      this.formData.customerPersonPhone = this.formatPersonPhoneNumber(
        this.formData.customerPersonPhone
      )
    },
    formatPhoneNumber(input) {
      // 숫자만 남김
      input = input.replace(/\D/g, '')

      if (input.startsWith('02')) {
        if (input.length <= 2) return input
        if (input.length <= 6) return `${input.slice(0, 2)}-${input.slice(2)}`
        if (input.length <= 10)
          return `${input.slice(0, 2)}-${input.slice(2, 6)}-${input.slice(6)}`
      } else {
        if (input.length <= 3) return input
        if (input.length <= 7) return `${input.slice(0, 3)}-${input.slice(3)}`
        if (input.length <= 11)
          return `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`
      }
      return input
    },
    formatPersonPhoneNumber(input) {
      // 숫자만 남김
      input = input.replace(/\D/g, '')

      if (input.startsWith('010')) {
        if (input.length <= 3) return input
        if (input.length <= 7) return `${input.slice(0, 3)}-${input.slice(3)}`
        if (input.length <= 11)
          return `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`
      }
      return input
    },
    validatePhoneNumber(phoneNumber) {
      // 02-1234-1234 또는 031-1234-1234 형식 허용
      const phoneRegex = /^(02|0[3-9][0-9])-(\d{3,4})-(\d{4})$/
      return phoneRegex.test(phoneNumber)
    },
    validatePersonPhoneNumber(phoneNumber) {
      // 010-1234-1234 형식 허용
      const phoneRegex = /^010-\d{4}-\d{4}$/
      return phoneRegex.test(phoneNumber)
    },
    // 토큰에서 사용자 이름 가져오는 메서드
    getUserNameFromToken() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const decodedToken = VueJwtDecode.decode(token)
          this.selectedEmployeeName = decodedToken.username || '이름 정보 없음'
          console.log('Decoded token:', decodedToken) // 토큰 구조 확인
        } catch (error) {
          console.error('토큰 디코딩 오류:', error)
          this.selectedEmployeeName = '디코딩 실패'
        }
      } else {
        this.selectedEmployeeName = '로그인 필요'
      }
    },
    close() {
      this.$emit('close')
      this.resetFormData()
    },
    resetFormData() {
      this.formData = {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        customerAdddetail: '',
        customerPersonName: '',
        customerPersonPhone: '',
        customerPersonEmail: '',
        registrationNumber: '',
        customerStatus: '거래중',
        customerSdate: '',
        customerNote: '',
        userName: '', // formData에서 사용자 이름 초기화
      }
      this.selectedEmployeeName = ''
    },
  },
  watch: {
    isEditMode(newVal) {
      if (newVal) {
        this.formData = { ...this.customerData }
      } else {
        this.resetFormData()
      }
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
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

label {
  font-size: 14px;
  color: #666;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3f72af;
  outline: none;
  box-shadow: 0 0 8px rgba(63, 114, 175, 0.3);
}

textarea {
  resize: none;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px; /* 버튼 사이 간격 */
  margin-top: 20px; /* 위로부터 간격 */
}

/* 스크롤바를 숨기기 위한 스타일 */
.modal-content::-webkit-scrollbar {
  display: none;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  color: white;
  background: #3f72af;
  transition: background 0.3s ease;
}

button:hover {
  background: #2c5987;
}

button[type="button"] {
  background: gray;
}

button[type="button"]:hover {
  background: #555;
}
</style>