import { createRouter, createWebHistory } from 'vue-router'
import EmployeeList from '@/components/employee/EmployeeList.vue'
import Login from '@/components/Login.vue'
import CustomerForm from '@/components/customer/CustomerForm.vue'
import CustomerList from '@/components/customer/CustomerList.vue'
import ProductList from '@/components/product/ProductList.vue'
import ResetPassword from '@/components/employee/ResetPassword.vue'
import InventoryList from '@/components/inventory/InventoryList.vue'
import InventoryHistoryList from '@/components/inventory/InventoryHistoryList.vue'
import OrderForm from '@/components/order/OrderForm.vue'
import OrderList from '@/components/order/OrderList.vue'
import ProductionList from '@/components/production/ProductionList.vue'
import SalesHistory from '@/components/sales/SalesHistory.vue'
import CustomerHistory from '@/components/sales/CustomerHistory.vue'
import TotalSalesBySalesperson from '@/components/sales/TotalSalesBySalesperson.vue'
import MonthlySalesStatistics from '@/components/sales/MonthlySalesStatistics.vue'
import Leave from '@/components/leave/LeaveList.vue'
import BoardList from '@/components/board/BoardList.vue'
import BoardDetail from '@/components/board/BoardDetail.vue'
import MyLeaveList from '@/components/leave/MyLeaveList.vue'
import MyAttList from '@/components/attendence/MyAttList.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home', 
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/components/Home.vue'),
      meta: { requiresAuth: true },
    },
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

    //판매 목록
    {
      path: '/order-list',
      name: 'OrderList',
      component: OrderList,
      meta: { requiresAuth: true },
    },    
    // 제품 목록
    {
      path:"/products",
      name:'products',
      component:ProductList,
      meta: { requiresAuth: true },
    },  
    //비밀번호 재설정(인증X)
    {
      path: '/resetPassword',
      name: ResetPassword,
      component: ResetPassword
    },
    // 재고 목록
    {
      path:"/inventory",
      name:'inventory',
      component:InventoryList,
      meta: { requiresAuth: true },
    },  
    // 재고 이력 목록
    {
      path:"/inventory/history",
      name:'inventory/history',
      component:InventoryHistoryList,
      meta: { requiresAuth: true },
    },  
    {
      path: '/register-order',
      name: 'Registerorder',
      component: OrderForm,
      meta: { requiresAuth: true },
    },
    // 생산 목록
    {
      path:"/production",
      name:'production',
      component:ProductionList,
      meta: { requiresAuth: true },
    },  
    {
      path: '/sales-history',
      name: 'SalesHistory',
      component: SalesHistory,
    },
    {
      path: '/customer-history',
      name: 'CustomerHistory',
      component: CustomerHistory, 
    },
    {
      path: '/totalsalesby-salesperson',
      name: 'TotalSalesBySalesperson',
      component: TotalSalesBySalesperson, 
    },
    {
      path: '/monthlysales-statistics',
      name: 'MonthlySalesStatistics',
      component: MonthlySalesStatistics, 
    },
    {
      path: '/leave',
      name: "Leave",
      component: Leave,
      meta: { requiresAuth: true},
    },
    {
      path: '/board-list/:type',
      name:'BoardList',
      component: BoardList,
      props:true,
    },
    {
      path: '/board-detail/:id',
      name: "BoardDetail",
      component: BoardDetail,
      props: true,
    },
    {
      path: '/my-leave',
      name: "myLeave",
      component: MyLeaveList,
      meta: {requiresAuth: true},
    },
    {
      path: '/my-att',
      name: "myAtt",
      component: MyAttList,
      meta: {requiresAuth: true},
    },
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