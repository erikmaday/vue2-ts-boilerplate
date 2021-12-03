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
            component: () =>
              import(
                /* webpackChunkName: "company-users" */ '@/views/Company.vue'
              ),
          },
          {
            path: 'vehicles',
            name: 'vehicles',
            component: () =>
              import(
                /* webpackChunkName: "company-vehicles" */ '@/views/Company.vue'
              ),
          },
          {
            path: 'garages',
            name: 'garages',
            component: () =>
              import(
                /* webpackChunkName: "companyGarages" */ '@/views/Company.vue'
              ),
          },
          {
            path: 'rates',
            name: 'rates',
            component: () =>
              import(
                /* webpackChunkName: "companyRates" */ '@/views/Company.vue'
              ),
          },
          {
            path: 'availability',
            name: 'availability',
            component: () =>
              import(
                /* webpackChunkName: "companyAvailability" */ '@/views/Company.vue'
              ),
          },
          {
            path: 'settings',
            name: 'settings',
            component: () =>
              import(
                /* webpackChunkName: "companySettings" */ '@/views/Company.vue'
              ),
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
