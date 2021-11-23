import dayjs from 'dayjs'

export interface GarageTimes {
  companyId: number
  tripId: number
  garageTimeId?: number
  garageId?: number
  departureTime?: dayjs.Dayjs
  returnGarageId?: number
  returnTime?: dayjs.Dayjs
  garageTimeNotes?: string
  returnGarageTimeNotes?: string
}
