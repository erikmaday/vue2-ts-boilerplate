import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import modules from './store/modules'
import '@/scss/main.scss'
import i18n from './i18n'
import '@/plugins/gmaps'
import '@/plugins/dayjs'
import CUIcon from '@/components/CUIcon.vue'
import VueTheMask from 'vue-the-mask'
import CUTextField from '@/components/CUTextField.vue'
import CUSelect from '@/components/CUSelect.vue'
import CUModal from '@/components/CUModal.vue'
import CUTextArea from '@/components/CUTextArea.vue'
import CUDataTable from '@/components/CUDataTable.vue'
import CUDatePicker from '@/components/CUDatePicker.vue'

Vue.use(VueTheMask)
Vue.component('CUIcon', CUIcon)
Vue.component('CUTextField', CUTextField)
Vue.component('CUTextArea', CUTextArea)
Vue.component('CUSelect', CUSelect)
Vue.component('CUModal', CUModal)
Vue.component('CUDataTable', CUDataTable)
Vue.component('CUDatePicker', CUDatePicker)
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
