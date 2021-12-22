import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import modules from './store/modules'
import '@/scss/main.scss'
import i18n from './i18n'
import '@/plugins/gmaps'
import VueDayjs from '@/plugins/dayjs'
import CUIcon from '@/components/CUIcon.vue'
import CUTextField from '@/components/CUTextField.vue'
import CUSelect from '@/components/CUSelect.vue'

Vue.use(VueDayjs)
Vue.component('CUIcon', CUIcon)
Vue.component('CUTextField', CUTextField)
Vue.component('CUSelect', CUSelect)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  created() {
    if (modules.auth.getIsTokenSet) {
      modules.auth.autoLogin()
    }
  },
  render: (h) => h(App),
}).$mount('#app')
