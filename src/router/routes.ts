import { RouteConfig } from 'vue-router'

export const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: () => import('@/views/Empty.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        children: [
          // {
          //   path: 'map',
          //   name: 'map',
          //   component: () =>
          //     import(@/views/Company.vue
          //       /* webpackChunkName: "map" */ '@/layouts/MapWithSidebar.vue'
          //     ),
          // },
        ],
      },
      {
        path: 'company',
        name: 'company',
        component: () =>
          import(
            /* webpackChunkName: "company" */ '@/views/Company.vue'
          ),
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
        ]
      },
    ],
  },
]
