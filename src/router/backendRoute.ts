import { getSession } from '@/common/utils/storage'
import { useUserInfo } from '@/store/userInfo'
import { dynamicRoutes, pathMatch } from './route'
import router from './index'
import { useRoutesList } from '@/store/routesList'
import openApi from '@/utils/openApi'
import { type RouteRecordRaw } from 'vue-router'
import { useKeepALiveNames } from '@/store/keepAliveNames'
import { Menu } from '@/common/menu'

const viewsModules: any = import.meta.glob([
  '../views/**/*.{vue,tsx}',
  '!../views/layout/**/*.{vue,tsx}'
])

const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...viewsModules })

export async function initBackEndControlRoutesFun() {
  const token = getSession('token') // 获取浏览器缓存 token 值
  if (!token) {
    // 无 token 停止执行下一步
    return false
  }
  //useUserInfo().setUserInfo({})
  // 获取路由
  let menuRoute: Menu = await getBackEndControlRoutes()
  dynamicRoutes[0].children = backEndRouterConverter(menuRoute) // 处理路由（component）
  // 添加404界面
  router.addRoute(pathMatch)
  resetRoute() // 删除/重置路由

  console.log('dynamicRoutes : ', dynamicRoutes)
  dynamicRoutes.forEach((route: any) => {
    router.addRoute(route as unknown as RouteRecordRaw)
  })
  useRoutesList().setRoutesList(dynamicRoutes[0].children)

  // const res = formatFlatteningRoutes(dynamicRoutes)
  // console.log('res : ', res)
  // const formartRoutes = formatTwoStageRoutes(res)
  // console.log('routes : ', formartRoutes)
  // formartRoutes.forEach((route: any) => {
  //   router.addRoute(route as unknown as RouteRecordRaw)
  // })
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

// 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
export async function getBackEndControlRoutes() {
  try {
    const menuAndPermission = await openApi.getPermissions()
    console.log('路由和权限为:', menuAndPermission)
    // 赋值权限码，用于控制按钮等
    useUserInfo().userInfo.permissions = menuAndPermission.permissions
    return menuAndPermission.menus
  } catch (e: any) {
    console.error(e)
    return []
  }
}

// 后端控制路由，后端返回路由 转换为vue route
export function backEndRouterConverter(routes: any, parentPath: string = '/') {
  if (!routes) return
  return routes.map((item: any) => {
    if (!item.meta) {
      return item
    }
    // 将json字符串的meta转为对象
    item.meta = JSON.parse(item.meta)
    // 将meta.comoponet 解析为route.component
    if (item.meta.component) {
      item.component = dynamicImport(dynamicViewsModules, item.meta.component)
      delete item.meta['component']
    }
    // route.path == resource.code
    let path = item.code
    // 如果不是以 / 开头，则路径需要拼接父路径
    if (!path.startsWith('/')) {
      path = parentPath + '/' + path
    }
    item.path = path
    delete item['code']

    // route.meta.title == resource.name
    item.meta.title = item.name
    delete item['name']

    // route.name == resource.meta.routeName
    item.name = item.meta.routeName
    delete item.meta['routeName']

    // route.redirect == resource.meta.redirect
    if (item.meta.redirect) {
      item.redirect = item.meta.redirect
      delete item.meta['redirect']
    }
    item.children && backEndRouterConverter(item.children, item.path)
    return item
  })
}

export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter((key) => {
    const k = key.replace(/..\/views|../, '')
    return k.startsWith(`${component}`) || k.startsWith(`/${component}`)
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  }
  if (matchKeys?.length > 1) {
    return false
  }
}

// 删除/重置路由
export function resetRoute() {
  useRoutesList().routesList.forEach((route: any) => {
    const { name } = route
    router.hasRoute(name) && router.removeRoute(name)
  })
}
