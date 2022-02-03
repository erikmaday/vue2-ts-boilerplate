import { RouteConfig } from 'vue-router'
import auth from '@/store/modules/auth'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/views/Empty.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
]
