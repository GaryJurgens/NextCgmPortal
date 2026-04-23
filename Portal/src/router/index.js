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
    // Explicitly allow access without a token
    meta: { isPublic: true, requiresAuth: false } 
  },
  { 
    path: '/settings', 
    name: 'Settings',
    component: Settings, 
    meta: { requiresAuth: true } 
  },
  // Catch-all route to prevent broken paths from looping to login
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
  
  // Initialize auth state if a token exists in storage 
  if (!authStore.token && localStorage.getItem('token')) {
    authStore.initializeAuth();
  }

  // Check metadata for the current route and its parents
  const isPublic = to.matched.some(record => record.meta.isPublic);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (isPublic) {
    // If the route is marked public (like PaymentVerify), proceed 
    next();
  } else if (requiresAuth && !authStore.isAuthenticated) {
    // If it requires auth and user isn't logged in, go to login 
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    });
  } else {
    // Otherwise, continue as normal
    next();
  }
});

export default router;