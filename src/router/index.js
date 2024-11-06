import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '@/components/employee/EmployeeList.vue'
import Login from '@/components/Login.vue'
import CustomerForm from '@/components/customer/CustomerForm.vue'
import CustomerList from '@/components/customer/CustomerList.vue'
import ResetPassword from '@/components/employee/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/empList",
      name: 'empList',
      component: EmployeeList,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: 'login',
      component: Login
    },  
    //고객사 등록
    {
      path: '/register-customer',
      name: 'RegisterCustomer',
      component: CustomerForm,
      meta: { requiresAuth: true },
    },
    
    //고객사 목록
    {
      path: '/customer-list',
      name: 'CustomerList',
      component: CustomerList,
      meta: { requiresAuth: true },
    },
    //비밀번호 재설정(인증X)
    {
      path: '/resetPassword',
      name: ResetPassword,
      component: ResetPassword
    }
  ],
})


// 인증 가드 설정
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null; // 로컬 스토리지에서 토큰 확인
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    next('/login');
  } else {
    next(); // 인증된 경우 또는 인증이 필요 없는 페이지는 계속 진행
  }
});

export default router
