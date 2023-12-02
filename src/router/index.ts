import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './route'
import pinia from '@/store/index'
import { useThemeConfig } from '@/store/themeConfig'
import { initBackEndControlRoutesFun, resetRoute } from './backendRoute'
import { getSession, clearSession } from '@/common/utils/storage'
import { useRoutesList } from '@/store/routesList'

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

export default router

// login 时调用
export async function initRouter() {
  // 初始化方法执行
  const isInit = useThemeConfig(pinia).themeConfig.isRequestRoutes
  if (!isInit) {
    // 未开启后端控制路由
  } else if (isInit) {
    // 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
    await initBackEndControlRoutesFun()
  }
}

let loadRouter = false

// 路由加载前
router.beforeEach(async (to, from, next) => {
  console.log('路由调用之前，打个日志，证明进来了')

  const token = getSession('token')
  if ((to.path === '/login' || to.path == '/oauth2/callback') && !token) {
    next()
    return
  }
  if (!token) {
    next(`/login?redirect=${to.path}`)
    clearSession()
    resetRoute()
    return
  }
  if (token && to.path === '/login') {
    next('/')

    return
  }

  // 不存在路由（避免刷新页面找不到路由）并且未加载过（避免token过期，导致获取权限接口报权限不足，无限获取），则重新初始化路由
  if (useRoutesList().routesList.length == 0 && !loadRouter) {
    await initRouter()
    loadRouter = true
    next({ path: to.path, query: to.query })
  } else {
    next()
  }
})
