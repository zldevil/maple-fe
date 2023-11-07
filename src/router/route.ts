import { type RouteRecordRaw } from 'vue-router';


// 定义静态路由
export const staticRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
        },
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/Home.vue'),
        meta: {
            title: 'home',
        },
    },
    {
        path: '/404',
        name: 'notFound',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: '找不到此页面',
        },
    },
    {
        path: '/401',
        name: 'noPower',
        component: () => import('@/views/error/401.vue'),
        meta: {
            title: '没有权限',
        },
    },
    {
        path: '/oauth2/callback',
        name: 'oauth2Callback',
        component: () => import('@/views/oauth/Oauth2Callback.vue'),
        meta: {
            title: 'oauth2回调',
        },
    },
];

// 定义404界面
export const pathMatch = {
    path: '/:path(.*)*',
    redirect: '/404',
};
