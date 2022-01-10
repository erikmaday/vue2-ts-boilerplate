import { RouteConfig } from 'vue-router'
// import { store } from '@/state/store'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/views/Empty.vue'),
    children: [
      {
        path: '/download-app',
        name: 'download-app',
        component: () => import('@/views/DownloadApp.vue'),
        meta: {
          publicRoute: true,
        },
      },
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
                    /* webpackChunkName: "vehicles-list" */ '@/views/Vehicles.vue'
                  ),
              },
              {
                path: 'add',
                name: 'vehicles.add',
                component: () =>
                  import(
                    /* webpackChunkName: "vehicles-add" */ '@/views/Vehicles.vue'
                  ),
              },
              {
                path: 'edit/:id',
                name: 'vehicles.edit',
                component: () =>
                  import(
                    /* webpackChunkName: "vehicles-edit" */ '@/views/Vehicles.vue'
                  ),
              },
              {
                path: 'view/:id',
                name: 'vehicles.view',
                component: () =>
                  import(
                    /* webpackChunkName: "vehicles-edit" */ '@/views/Vehicles.vue'
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
// routes.beforeEach((routeTo, routeFrom, next) => {
//   baseUrl()

//   store.dispatch('app/closeDialog')

//   function redirectToLogin() {
//     next({
//       name: 'login',
//       query: {
//         redirectFrom: routeTo.fullPath,
//       },
//     })
//   }

//   const authRequired = !routeTo.matched.some((route) => route.meta.publicRoute)

//   if (!authRequired) {
//     next()
//     return
//   }

//   if (store.getters['auth/loggedIn']) {
//     store.dispatch('auth/validate').then((validUser) => {
//       if (validUser) {
//         const currentUser = store.getters['auth/currentUser'] || {}
//         if (!currentUser.company) {
//           redirectToLogin()
//           return
//         }

//         const currentUserProfile = store.getters['auth/currentUserProfile']
//         if (currentUserProfile && currentUserProfile.roles.length) {
//           const isDriver = currentUserProfile.roles.some(
//             (role) => role.roleName === 'is_driver'
//           )
//           const isAdmin = currentUserProfile.roles.some((role) =>
//             [
//               'is_free_admin',
//               'is_paid_admin',
//               'is_broker_admin',
//               'is_admin_admin',
//             ].includes(role.roleName)
//           )
//           const isUser = currentUserProfile.roles.some((role) =>
//             [
//               'is_free_user',
//               'is_paid_user',
//               'is_broker_user',
//               'is_report_admin',
//             ].includes(role.roleName)
//           )
//           if (!isAdmin && !isUser && isDriver) {
//             next({
//               name: 'download-app',
//             })
//           }
//         }
