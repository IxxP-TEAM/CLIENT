<template>
  <div>
    <h2>직원 목록</h2>
    <button @click="openModal">직원 등록</button>
    <employee-modal
      :isVisible="isModalVisible"
      :closeModal="closeModal"
    />
    <ul>
      <li v-for="employee in employees" :key="employee.email">{{ employee.name }}</li>
    </ul>
  </div>
</template>

<script>
import EmployeeModal from './EmployeeModal.vue';

export default {
  components: {
    EmployeeModal,
  },
  data() {
    return {
      isModalVisible: false,
      employees: [], // 실제 직원 목록은 API를 통해 가져와야 함
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    }
  }
};
</script>