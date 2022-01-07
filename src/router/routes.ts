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
            path: 'profile',
            name: '',
            component: () => import('@/views/Empty.vue'),
            children: [
              {
                path: '',
                name: 'profile',
                component: () => import('@/views/Profile.vue'),
              },
              {
                path: 'edit',
                name: 'profile.edit',
                component: () => import('@/views/Profile.vue'),
              },
              {
                path: 'password',
                name: 'profile.password',
                component: () => import('@/views/Profile.vue'),
              },
            ],
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
                        /* webpackChunkName: "company-users" */ '@/views/Users.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'users.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/views/Users.vue'
                      ),
                  },
                  {
                    path: 'view/:id',
                    name: 'users.view',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/views/Users.vue'
                      ),
                  },
                  {
                    path: 'add',
                    name: 'users.add',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/views/Users.vue'
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
                        /* webpackChunkName: "company-vehicles-list" */ '@/views/Vehicles.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'vehicles.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-vehicles-edit" */ '@/views/Vehicles.vue'
                      ),
                  },

                  {
                    path: 'view/:id',
                    name: 'vehicles.view',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-vehicles-view" */ '@/views/Vehicles.vue'
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
                        /* webpackChunkName: "company-garages-list" */ '@/views/Garages.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'garages.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-garages-detail-edit" */ '@/views/GaragesDetail.vue'
                      ),
                  },
                  {
                    path: 'view/:id',
                    name: 'garages.view',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-garages-detail-view" */ '@/views/GaragesDetail.vue'
                      ),
                  },
                  {
                    path: 'add',
                    name: 'garages.add',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-garages-detail-add" */ '@/views/GaragesDetail.vue'
                      ),
                  },
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
                    /* webpackChunkName: "company-availability" */ '@/views/Availability.vue'
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
            component: () => import('@/views/Empty.vue'),
            children: [
              {
                path: ':id',
                name: 'bid-detail',
                component: () =>
                  import(
                    /* webpackChunkName: "bid-detail" */ '@/views/BidDetail.vue'
                  ),
              },
              {
                path: 'multi/:id',
                name: 'multi-bid-detail',
                component: () =>
                  import(
                    /* webpackChunkName: "multi-bid-detail" */ '@/views/BidDetail.vue'
                  ),
              },
            ],
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
            path: 'metrics',
            name: 'metrics',
            component: () => import('@/views/Empty.vue'),
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
          {
            path: 'setPassword/:hash',
            name: 'setPassword',
            component: () =>
              import(
                /* webpackChunkName: "setPassword" */ '@/views/SetPassword.vue'
              ),
            props: (router) => ({
              hash: router.params.hash,
            }),
          },
        ],
      },
    ],
  },
]
