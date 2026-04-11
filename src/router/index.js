import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';

// Views
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import TransactionCreateView from '@/views/TransactionCreateView.vue';
import TransactionView from '@/views/TransactionView.vue';
import CalendarView from '@/views/CalendarView.vue';
import CategoryView from '@/views/CategoryView.vue';
import ChartView from '@/views/ChartView.vue';
import ProfileEditView from '@/views/ProfileEditView.vue';
import TransactionDetailView from '@/views/TransactionDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login', // 최초 접속 시 가드에 의해 이곳으로 튕겨옴
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/',
      redirect: '/calendar',
    },
    {
      path: '/calendar', // 로그인 성공 시 보여줄 메인 화면 (달력)
      name: 'calendar',
      component: CalendarView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionView,
      meta: { requiresAuth: true },
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryView,
      meta: { requiresAuth: true },
    },
    {
      path: '/chart',
      name: 'chart',
      component: ChartView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction/create',
      name: 'transaction-create',
      component: TransactionCreateView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile-edit',
      name: 'profile-edit',
      component: ProfileEditView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transaction/detail/:id',
      name: 'transactions-detail',
      component: TransactionDetailView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isLogin) {
    // 1. 로그인이 필요한데 안 한 경우 -> 로그인 창으로 쫓아냄
    return '/login';
  }

  if ((to.path === '/login' || to.path === '/signup') && userStore.isLogin) {
    // 2. 이미 로그인했는데 로그인 창으로 가려는 경우 -> 달력으로 돌려보냄
    return '/';
  }

  // 3. 정상적인 접근이면 아무것도 반환하지 않거나 return true를 하면 통과됩니다!
  return true;
});

export default router;
