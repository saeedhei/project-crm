import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth' // Adjust path as needed

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginForm.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      const token = localStorage.getItem('jwt_token')
      if (token) {
        try {
          await authStore.setToken(token)
        } catch (error) {
          console.error('Error validating token:', error)
          next('/login')
          return
        }
      }
    }

    if (!authStore.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login'];
//   const isLoggedIn = store.getters.isAuthenticated;

//   if (!publicPages.includes(to.path) && !isLoggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router
