import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore.js';

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
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/', redirect: '/login' },
    {
      path: '/calendar',
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

router.beforeEach((to) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isLogin) {
    return '/login';
  }

  if ((to.path === '/login' || to.path === '/signup') && userStore.isLogin) {
    return '/calendar';
  }

  return true;
});

export default router;
