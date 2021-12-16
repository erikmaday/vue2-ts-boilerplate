import Vue from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default Object.defineProperties(Vue.prototype, {
  $dayjs: {
    get() {
      return dayjs
    },
  },
})
