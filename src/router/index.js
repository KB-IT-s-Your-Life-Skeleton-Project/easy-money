import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import TransactionCreateView from '@/views/TransactionCreateView.vue';
import TransactionView from '@/views/TransactionView.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionDetailView from '@/views/TransactionDetailView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/transation/create',
      name: 'transation-create',
      component: TransactionCreateView,
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
    {
      path: '/transaction/detail',
      name: 'transactions-detail',
      component: TransactionDetailView,
    },
  ],
});

export default router;
