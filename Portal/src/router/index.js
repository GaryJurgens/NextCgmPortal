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
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: Login,
    meta: { isPublic: true }
  },
  { 
    path: '/register', 
    name: 'Register',
    component: Register,
    meta: { isPublic: true }
  },
  { 
    path: '/verify-otp', 
    name: 'VerifyOtp',
    component: VerifyOtp,
    meta: { isPublic: true }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard',
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/payment', 
    name: 'Payment',
    component: Payment, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/payment-verify', 
    name: 'PaymentVerify',
    component: PaymentVerify,
    // Alias handles the gateway potentially adding a trailing slash
    alias: '/payment-verify/',
    // Explicitly set BOTH flags to ensure no ambiguity
    meta: { isPublic: true, requiresAuth: false } 
  },
  { 
    path: '/settings', 
    name: 'Settings',
    component: Settings, 
    meta: { requiresAuth: true } 
  },
  // Catch-all to prevent undefined paths from looping
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // 1. Initialize auth state from localStorage if needed
  if (!authStore.token && localStorage.getItem('token')) {
    authStore.initializeAuth();
  }

  // 2. CHECK PUBLIC STATUS FIRST
  // We check if 'isPublic' is explicitly true on the route or any parent route
  const isPublic = to.matched.some(record => record.meta.isPublic === true);

  if (isPublic) {
    // If it's public, allow access immediately and STOP execution of this guard
    return next();
  }

  // 3. CHECK AUTHENTICATION
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth === true);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login but keep the intended destination in the query
    return next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    });
  }

  // 4. DEFAULT FALLBACK
  next();
});

export default router;