import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '@/components/admin/EmployeeList.vue'
<<<<<<< HEAD
import ProductList from '@/components/product/ProductList.vue'
=======
import CustomerForm from '@/components/customer/CustomerForm.vue'
import CustomerList from '@/components/customer/CustomerList.vue'
>>>>>>> d9560b1fc654c3d704ff5c6c8a9d379ef0639f80

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/empList",
      name: 'empList',
      component: EmployeeList,
    },
<<<<<<< HEAD
    {
      path:"/products",
      name:'products',
      component:ProductList,
      // meta: { requiresAuth: true },
    }
  ],
})

=======
    
    //고객사 등록
    {
      path: '/register-customer',
      name: 'RegisterCustomer',
      component: CustomerForm,
    },
    
    //고객사 목록
    {
      path: '/customer-list',
      name: 'CustomerList',
      component: CustomerList
      
    }  
  ],
})


>>>>>>> d9560b1fc654c3d704ff5c6c8a9d379ef0639f80
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

<<<<<<< HEAD
=======

>>>>>>> d9560b1fc654c3d704ff5c6c8a9d379ef0639f80
export default router
