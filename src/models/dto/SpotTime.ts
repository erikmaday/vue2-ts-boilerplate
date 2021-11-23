import dayjs from 'dayjs'

export type SpotTime = {
  companyId: number
  tripId: number
  stopId: number
  spotTime: dayjs.Dayjs
  active: boolean
}
