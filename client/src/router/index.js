import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true, authority: [0] }
    },
    {
      path: '/farmers',
      name: 'farmers',
      component: () => import('../views/UserManage.vue'),
      meta: { requiresAuth: true, authority: [0] }
    },
    {
      // 原任务管理，现改为助农社区，所有登录用户均可访问
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/dataManage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/news.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/personal',
      name: 'personal',
      component: () => import('../views/personal.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/logout',
      name: 'logout',
      redirect: '/login'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  if (to.meta.requiresAuth) {
    if (!user) {
      next({ path: '/login' })
    } else if (to.meta.authority && !to.meta.authority.includes(user.authority)) {
      ElMessage.error('您没有权限访问该页面')
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router