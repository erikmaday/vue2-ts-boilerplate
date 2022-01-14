import { RouteConfig } from 'vue-router'
// import { store } from '@/state/store'

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
                        /* webpackChunkName: "company-users" */ '@/views/UsersList.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'users.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/views/UsersDetail.vue'
                      ),
                  },
                  {
                    path: 'view/:id',
                    name: 'users.view',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/views/UsersDetail.vue'
                      ),
                  },
                  {
                    path: 'add',
                    name: 'users.add',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-users" */ '@/views/UsersDetail.vue'
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
                        /* webpackChunkName: "company-vehicles-list" */ '@/views/VehiclesList.vue'
                      ),
                  },
                  {
                    path: 'edit/:id',
                    name: 'vehicles.edit',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-vehicles-edit" */ '@/views/VehicleDetail.vue'
                      ),
                  },

                  {
                    path: 'view/:id',
                    name: 'vehicles.view',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-vehicles-view" */ '@/views/VehicleDetail.vue'
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
                        /* webpackChunkName: "company-garages-list" */ '@/views/GaragesList.vue'
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
                component: () =>
                  import(
                    /* webpackChunkName: "company-rates" */ '@/views/Empty.vue'
                  ),
                children: [
                  {
                    path: '',
                    name: 'rates',
                    component: () =>
                      import(
                        /* webpackChunkName: "company-garages-edit" */ '@/views/Rates.vue'
                      ),
                  },
                  // Commenting out until these components are used in v2
                  // {
                  //   path: 'adjustments',
                  //   name: 'rates.adjustments',
                  //   component: () =>
                  //     import(
                  //       /* webpackChunkName: "company-garages-edit" */ '@/views/Rates.vue'
                  //     ),
                  // },
                  // {
                  //   path: 'calculator',
                  //   name: 'rates.calculator',
                  //   component: () =>
                  //     import(
                  //       /* webpackChunkName: "company-garages-edit" */ '@/views/Rates.vue'
                  //     ),
                  // },
                ],
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
                children: [
                  {
                    path: '',
                    name: 'settings',
                    component: () => import('@/views/Company.vue'),
                  },
                  {
                    path: 'edit',
                    name: 'settings.edit',
                    component: () => import('@/views/Company.vue'),
                  },
                ],
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
                    /* webpackChunkName: "vehicles-list" */ '@/views/VehiclesList.vue'
                  ),
              },
              {
                path: 'add',
                name: 'vehicles.add',
                component: () =>
                  import(
                    /* webpackChunkName: "vehicles-add" */ '@/views/VehicleDetail.vue'
                  ),
              },
              {
                path: 'edit/:id',
                name: 'vehicles.edit',
                component: () =>
                  import(
                    /* webpackChunkName: "vehicles-edit" */ '@/views/VehicleDetail.vue'
                  ),
              },
              {
                path: 'view/:id',
                name: 'vehicles.view',
                component: () =>
                  import(
                    /* webpackChunkName: "vehicles-edit" */ '@/views/VehicleDetail.vue'
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
                path: '',
                name: 'marketplace',
                component: () =>
                  import(
                    /* webpackChunkName: "marketplace" */ '@/views/Marketplace.vue'
                  ),
              },
              {
                path: ':id',
                name: 'bid-detail',
                component: () =>
                  import(
                    /* webpackChunkName: "bid-detail" */ '@/views/BidDetail.vue'
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
                path: '',
                name: 'bookings',
                component: () =>
                  import(
                    /* webpackChunkName: "bookings" */ '@/views/Bookings.vue'
                  ),
              },
              {
                path: ':id',
                name: 'booking-detail',
                component: () =>
                  import(
                    /* webpackChunkName: "booking-detail" */ '@/views/BookingDetail.vue'
                  ),
              },
            ],
          },
          // {
          //   path: 'metrics',
          //   name: 'metrics',
          //   component: () => import('@/views/Empty.vue'),
          // },
        ],
      },
      {
        path: '',
        name: 'preauth',
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: 'login',
            name: 'login',
            component: () =>
              import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
          },
          {
            path: 'setPassword/:hash',
            name: 'set-password',
            component: () =>
              import(
                /* webpackChunkName: "setPassword" */ '@/views/SetPassword.vue'
              ),
            props: (router) => ({
              hash: router.params.hash,
            }),
          },
          {
            path: '/downloadApp',
            name: 'download-app',
            component: () => import('@/views/DownloadApp.vue'),
          },
          {
            path: 'forgotPassword',
            name: 'forgot-password',
            component: () =>
              import(
                /* webpackChunkName: "forgotPassword" */ '@/views/ForgotPassword.vue'
              ),
          },
          {
            path: '/*',
            name: 'not-found',
            component: () =>
              import(
                /* webpackChunkName: "not-found" */ '@/views/NotFound.vue'
              ),
          },
        ],
      },
    ],
  },
]
