import dayjs from 'dayjs'
import { Address } from './Address'
import { SpotTime } from './SpotTime'

export interface Stop {
  orderIndex: number
  isArrived: boolean
  addressId: number
  isPickupEstimated: boolean
  isDropoffEstimated: boolean
  stopId: number
  tripId: number
  pickupDatetime: string
  dropoffDatetime: string
  startDatetime?: string
  createdOn: string
  updatedOn?: string
  address: Address
  spotTime?: SpotTime
  notes?: string
  active: boolean
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
}
