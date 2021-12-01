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
          {
            path: 'company',
            name: 'company',
            component: () =>
              import(/* webpackChunkName: "map" */ '@/views/MyCompany.vue'),
          },
          // {
          //   path: 'map',
          //   name: 'map',
          //   component: () =>
          //     import(
          //       /* webpackChunkName: "map" */ '@/layouts/MapWithSidebar.vue'
          //     ),
          // },
        ],
      },
    ],
  },
]
