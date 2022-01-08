import Vue from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export default Object.defineProperties(Vue.prototype, {
  $dayjs: {
    get() {
      return dayjs
    },
  },
})
