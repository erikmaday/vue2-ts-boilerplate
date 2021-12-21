import { RouteConfig } from 'vue-router'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/views/Empty.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: 'today',
        meta: {
          requiresAuth: true,
        },
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: 'today',
            name: 'today',
            component: () => import('@/views/Today.vue'),
          },
          {
            path: 'company',
            name: 'company',
            redirect: 'company/users',
            component: () =>
              import(/* webpackChunkName: "company" */ '@/views/Empty.vue'),
            children: [
              {
                path: 'users',
                component: () =>
                  import(/* webpackChunkName: "company" */ '@/views/Empty.vue'),
                children: [
                  {
                    path: '',
                    name: 'users',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/components/CompanyUsers.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'users.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/components/CompanyUsers.vue'
                      ),
                  },
                ],
              },
              {
                path: 'vehicles',
                component: () =>
                  import(
                    /* webpackChunkName: "company-vehicles" */ '@/views/Empty.vue'
                  ),
                children: [
                  {
                    path: '',
                    name: 'vehicles',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-vehicles-list" */ '@/components/CompanyVehicles.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'vehicles.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-vehicles-edit" */ '@/components/CompanyVehicles.vue'
                      ),
                  },
                ],
              },
              {
                path: 'garages',
                component: () =>
                  import(
                    /* webpackChunkName: "company-garages" */ '@/views/Empty.vue'
                  ),
                children: [
                  {
                    path: '',
                    name: 'garages',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-garages-list" */ '@/components/CompanyGarages.vue'
                      ),
                  },
                  {
                    path: 'edit/:id', 
                    name: 'garages.edit', 
                    component: () =>
                      import(
                        /* webpackChunkName: "company-garages-edit" */ '@/components/CompanyGaragesEdit.vue'
                      ),
                  }
                ],
              },
              {
                path: 'rates',
                name: 'rates',
                component: () =>
                  import(
                    /* webpackChunkName: "company-rates" */ '@/views/Empty.vue'
                  ),
              },
              {
                path: 'availability',
                name: 'availability',
                component: () =>
                  import(
                    /* webpackChunkName: "company-availability" */ '@/views/Empty.vue'
                  ),
              },
              {
                path: 'settings',
                name: 'settings',
                component: () =>
                  import(
                    /* webpackChunkName: "company-settings" */ '@/views/Empty.vue'
                  ),
              },
            ],
          },

          {
            path: 'marketplace',
            name: 'marketplace',
          },
          {
            path: 'bookings',
            name: 'bookings',
            component: () => import('@/views/Empty.vue'),
            children: [
              {
                path: ':id',
                name: 'booking-detail',
                component: () =>
                  import(
                    /* webpackChunkName: "quote-detail" */ '@/views/BookingDetail.vue'
                  ),
              },
            ],
          },
          {
            path: 'trips',
            name: 'trips',
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
