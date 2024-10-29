import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '@/components/admin/EmployeeList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/empList",
      name: 'empList',
      component: EmployeeList,
    },
  ],
})

export default router
