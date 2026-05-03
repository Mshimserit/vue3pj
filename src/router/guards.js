// src/router/guards.js
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

// 需要登录才能访问的路由
const requiresAuth = [
  '/checkout',
  '/pay',
  '/paycallback',
  '/member'
]

// 已经登录不能访问的路由（登录页）
const requiresGuest = [
  '/login'
]

export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const isAuth = !!userStore.userInfo.token

    // 需要登录的页面
    if (requiresAuth.some(path => to.path.startsWith(path))) {
      if (!isAuth) {
        ElMessage.warning('请先登录')
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
    }

    // 已登录用户访问登录页
    if (requiresGuest.includes(to.path) && isAuth) {
      next(from.fullPath || '/')
      return
    }

    next()
  })
}