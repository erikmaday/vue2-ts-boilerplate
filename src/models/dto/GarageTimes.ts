import dayjs from 'dayjs'
import { Garage } from './Garage';

export interface GarageTimes {
  companyId: number
  tripId: number
  garageTimeId?: number
  garage?: Garage
  garageId?: number
  departureTime?: string
  returnGarageId?: number
  returnTime?: string
  returnGarage?: Garage
  garageTimeNotes?: string
  returnGarageTimeNotes?: string
}
