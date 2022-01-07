import dayjs from 'dayjs'

export interface GarageTimes {
  companyId: number
  tripId: number
  garageTimeId?: number
  garageId?: number
  departureTime?: string
  returnGarageId?: number
  returnTime?: string
  garageTimeNotes?: string
  returnGarageTimeNotes?: string
}
