/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import { DayJs } from 'dayjs'

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs(
      date?: dayjs.ConfigType,
      option?: dayjs.OptionType,
      locale?: string
    ): dayjs.Dayjs
  }
}
