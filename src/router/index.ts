import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import { routes } from './routes'
import modules from '@/store/modules'
import deepClone from '@/utils/deepClone'

Vue.use(VueRouter)
Vue.use(VueMeta)

const auth = modules.auth

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  modules.app.saveLastRoute(from)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (!requiresAuth) {
    next()
  } else if (!auth.getIsTokenSet) {
    next({ name: 'login' })
  } else if (auth.getIsDriverOnly) {
    next({ name: 'download-app' })
  } else {
    next()
  }
})

export default router
