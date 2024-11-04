import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '@/components/admin/EmployeeList.vue'
import Login from '@/components/Login.vue'

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