import { RouteConfig } from 'vue-router'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/views/Empty.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          requiresAuth: true,
        },
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: '',
            name: 'today',
            component: () => import('@/views/Today.vue'),
          },
        ],
      },
      {
        path: '',
        name: 'preauth',
        component: () => import('@/views/PreAuth.vue'),
        children: [
          {
            path: 'login',
            name: 'login',
            component: () =>
              import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
          },
        ],
      },
    ],
  },
]
