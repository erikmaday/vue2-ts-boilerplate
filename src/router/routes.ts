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
        children: [],
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
      {
        path: 'company',
        name: 'company',
        component: () =>
          import(/* webpackChunkName: "company" */ '@/views/Company.vue'),
        children: [
          {
            path: 'users',
            name: 'users',
            props: { mode: 'users' },
            component: () => import('@/views/Company.vue'),
          },
          {
            path: 'vehicles',
            name: 'vehicles',
            component: () => import('@/views/Company.vue'),
          },
          {
            path: 'garages',
            name: 'garages',
            component: () => import('@/views/Company.vue'),
          },
          {
            path: 'rates',
            name: 'rates',
            component: () => import('@/views/Company.vue'),
          },
          {
            path: 'availability',
            name: 'availability',
            component: () => import('@/views/Company.vue'),
          },
          {
            path: 'settings',
            name: 'settings',
            component: () => import('@/views/Company.vue'),
          },
        ],
      },
      {
        path: 'dashboard',
        name: 'dashboard',
      },
      {
        path: 'marketplace',
        name: 'marketplace',
      },
      {
        path: 'bookings',
        name: 'bookings',
      },
      {
        path: 'trips',
        name: 'trips',
      },
    ],
  },
]
