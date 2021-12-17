import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

const API_KEY = 'AIzaSyCe-36GFHdejJC2VVLYiHcfZBI9fBi37Tg'

Vue.use(VueGoogleMaps, {
  load: {
    key: API_KEY,
    installComponents: true,
  },
})
