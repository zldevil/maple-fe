import { type RouteRecordRaw } from 'vue-router'
import Layout from '@/views/layout/index.vue'

// 定义动态路由
export const dynamicRoutes = [
  {
    path: '/',
    name: '/',
    componexnt: Layout,
    redirect: '/home',
    meta: {
      isKeepAlive: true
    },
    // children: [],
    children: [
      // {
      //     path: '/home',
      //     name: 'home',
      //     component: () => import('@/views/home/Home.vue'),
      //     meta: {
      //         title: '首页',
      //         link: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: true,
      //         isIframe: false,
      //         icon: 'el-icon-s-home',
      //     },
      // },
      // {
      //     path: '/sys',
      //     name: 'Resource',
      //     redirect: '/sys/resources',
      //     meta: {
      //         title: '系统管理',
      //         code: 'sys',
      //         icon: 'el-icon-monitor',
      //     },
      //     children: [
      //         {
      //             path: 'sys/resources',
      //             name: 'ResourceList',
      //             component: () => import('@/views/system/resource'),
      //             meta: {
      //                 title: '资源管理',
      //                 code: 'resource:list',
      //                 isKeepAlive: true,
      //                 icon: 'el-icon-menu',
      //             },
      //         },
      //         {
      //             path: 'sys/roles',
      //             name: 'RoleList',
      //             component: () => import('@/views/system/role'),
      //             meta: {
      //                 title: '角色管理',
      //                 code: 'role:list',
      //                 isKeepAlive: true,
      //                 icon: 'el-icon-menu',
      //             },
      //         },
      //         {
      //             path: 'sys/accounts',
      //             name: 'ResourceList',
      //             component: () => import('@/views/system/account'),
      //             meta: {
      //                 title: '账号管理',
      //                 code: 'account:list',
      //                 isKeepAlive: true,
      //                 icon: 'el-icon-menu',
      //             },
      //         },
      //     ],
      // },
      // {
      //     path: '/personal',
      //     name: 'personal',
      //     component: () => import('@/views/personal/index.vue'),
      //     meta: {
      //         title: '个人中心',
      //         isKeepAlive: true,
      //         icon: 'el-icon-user',
      //     },
      // },
    ]
  }
]

// 定义静态路由
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Home.vue'),
    meta: {
      title: 'home'
    }
  }
]

// 定义404界面
export const pathMatch = {
  path: '/:path(.*)*',
  redirect: '/404'
}
