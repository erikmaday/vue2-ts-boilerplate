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
          //   path: 'sidenav',
          //   name: 'sidenav',
          //   component: () =>
          //     import(
          //       /* webpackChunkName: "sidenav" */ '@/views/SideNavTest.vue'
          //     ),
          // },
        ],
      },
    ],
  },
]
