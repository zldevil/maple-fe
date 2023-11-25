import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { staticRoutes, pathMatch, dynamicRoutes } from './route'
import pinia from '@/store/index'
import { useThemeConfig } from '@/store/themeConfig'
import { useUserInfo } from '@/store/userInfo'
import { useRoutesList } from '@/store/routesList'
import { useKeepALiveNames } from '@/store/keepAliveNames'



const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
})

export default router

// login 时调用
export async function initRouter() {
  // 初始化方法执行
  const { isRequestRoutes } = useThemeConfig(pinia).themeConfig
  if (!isRequestRoutes) {
    // 未开启后端控制路由
    initAllFun()
  } else if (isRequestRoutes) {
    // 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
    // await initBackEndControlRoutesFun();
  }
}

// 前端控制路由：初始化方法，防止刷新时丢失
export function initAllFun() {
  router.addRoute(pathMatch) // 添加404界面
  // 添加动态路由
  setFilterRouteEnd().forEach((route: any) => {
    router.addRoute(route as unknown as RouteRecordRaw)
  })
  // 过滤权限菜单
  useRoutesList().setRoutesList(
    setFilterMenuFun(dynamicRoutes[0].children, useUserInfo().userInfo.menus)
  )
}

// 比对后的路由表，进行重新赋值
export function setFilterRouteEnd() {
  let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))
  filterRouteEnd[0].children = setFilterRoute(filterRouteEnd[0].children)
  return filterRouteEnd
}

// 获取当前用户的权限去比对路由表，用于动态路由的添加
export function setFilterRoute(chil: any) {
  let filterRoute: any = []
  chil.forEach((route: any) => {
    // 如果路由需要拥有指定code才可访问，则校验该用户菜单是否存在该code
    if (route.meta.code) {
      useUserInfo().userInfo.menus.forEach((m: any) => {
        if (route.meta.code == m) {
          filterRoute.push({ ...route })
        }
      })
    } else {
      filterRoute.push({ ...route })
    }
  })
  return filterRoute
}

// 多级嵌套数组处理成一维数组
export function formatFlatteningRoutes(arr: any) {
  if (arr.length <= 0) return false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1))
    }
  }
  return arr
}

// 多级嵌套数组处理后的一维数组，再处理成 `定义动态路由` 的格式
// 只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存
// isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
export function formatTwoStageRoutes(arr: any) {
  if (arr.length <= 0) return false
  const newArr: any = []
  const cacheList: Array<string> = []
  arr.forEach((v: any) => {
    if (v.path === '/') {
      newArr.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      })
    } else {
      newArr[0].children.push({ ...v })
      if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
        cacheList.push(v.name)
      }
    }
  })
  useKeepALiveNames().setCacheKeepAlive(cacheList)
  return newArr
}

// 递归过滤有权限的路由
export function setFilterMenuFun(routes: any, menus: any) {
  const menu: any = []
  routes.forEach((route: any) => {
    const item = { ...route }
    if (hasAnth(menus, item)) {
      if (item.children) {
        item.children = setFilterMenuFun(item.children, menus)
      }
      menu.push(item)
    }
  })
  return menu
}

// 判断路由code 是否包含当前登录用户menus字段中，menus为字符串code数组
export function hasAnth(menus: any, route: any) {
  if (route.meta && route.meta.code) {
    return menus.includes(route.meta.code)
  }
  return true
}



// 路由加载前
router.beforeEach(async (to, from, next) => {
    console.log("路由调用之前")
    next();
});
