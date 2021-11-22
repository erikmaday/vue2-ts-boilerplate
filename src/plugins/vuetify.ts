import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from '@/scss/colors.scss'
import { toCamel } from '@/utils/string'
Vue.use(Vuetify)

const caseConvertedColors: { [index: string]: string } = {}
for (const [key, value] of Object.entries(colors)) {
  Object.defineProperty(caseConvertedColors, toCamel(key), {
    value: value,
  })
}

export default new Vuetify({
  theme: {
    themes: {
      light: {
        ...caseConvertedColors,
      },
    },
  },
})
