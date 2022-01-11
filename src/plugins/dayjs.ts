import Vue from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localeData from 'dayjs/plugin/localeData'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localeData)
dayjs.extend(advancedFormat)

Vue.prototype.$dayjs = dayjs
// import Vue from 'vue';
// import dayjs from 'dayjs';
// import 'dayjs/locale/en';

// import relativeTime from 'dayjs/plugin/relativeTime';
// import LocalizedFormat from 'dayjs/plugin/localizedFormat';
// import utc from 'dayjs/plugin/utc';

// dayjs.locale(process.env.VUE_APP_I18N_LOCALE);
// dayjs.extend(relativeTime);
// dayjs.extend(LocalizedFormat);
// dayjs.extend(utc);
// Vue.prototype.$dayjs = dayjs;
