import { type RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/index.vue'

// 定义动态路由
export const dynamicRoutes = [
  {
    path: '/',
    name: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      isKeepAlive: true
    },
    children: []
  }
]

// 定义静态路由
export const staticRoutes: Array<RouteRecordRaw> = [
  // {·
  //   path: '/',
  //   name: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   meta: {
  //     isKeepAlive: true
  //   },
  //   children: [
  //     {
  //       path: '/home',
  //       name: 'home',
  //       component: ()=> import('@/views/home/.vue'),
  //       redirect: '/home',
  //       meta: {
  //         isKeepAlive: true
  //       },
  //       children: []
  //     },
  //     {
  //       path: '/rds',
  //       name: 'home',
  //       component: () => import('@/views/rds/dsn.vue'),
  //       meta: {
  //         title: 'rds'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/event',
    name: 'event',
    component: () => import('@/views/event/index.vue'),
    meta: {
      title: 'home'
    }
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '找不到此页面'
    }
  }
]

// 定义404界面
export const pathMatch = {
  path: '/:path(.*)*',
  redirect: '/404'
}
