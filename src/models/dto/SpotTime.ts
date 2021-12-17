import dayjs from 'dayjs'

export interface SpotTime {
  companyId: number
  tripId: number
  stopId: number
  spotTime: dayjs.Dayjs
  active: boolean
}
