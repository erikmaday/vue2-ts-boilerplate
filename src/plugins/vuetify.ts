import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from '@/scss/_colors-export.scss'
import { toCamel } from '@/utils/string'
Vue.use(Vuetify)

const caseConvertedColors: { [index: string]: string } = {}
for (const [key, value] of Object.entries(colors)) {
  const convertedKey: string = toCamel(`${key}`)
  caseConvertedColors[convertedKey] = value
}

export default new Vuetify({
  theme: {
    themes: {
      light: caseConvertedColors,
    },
  },
})
