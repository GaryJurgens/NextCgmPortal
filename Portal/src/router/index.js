import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import VerifyOtp from '../views/VerifyOtp.vue';
import Payment from '../views/Payment.vue';
import Settings from '../views/Settings.vue';
import PaymentVerify from '../views/PaymentVerify.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/verify-otp', component: VerifyOtp },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/payment', component: Payment, meta: { requiresAuth: true } },
  { path: '/payment-verify', component: PaymentVerify,meta: { isPublic: true }  },
  { path: '/settings', component: Settings, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.token && localStorage.getItem('token')) {
    authStore.initializeAuth();
  }

  // Check if the route specifically requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login, but save the intended destination
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
