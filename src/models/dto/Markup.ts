import { ApiResult } from './ApiResult'
import { VehicleType } from './Vehicle'
import { Type } from './Type'

export interface Markup {
  markupId: number
  markupTypeId?: number
  markupPercentage: number
  name: string
  vehicleType?: VehicleType
  rateType?: Type
  markupDays: MarkupDay[]
  startDate: string
  endDate: string
}

export interface MarkupDetail {
  markupId: number
  markupTypeId?: number
  markupPercentage: number
  name: string
  customerId?: number
  customerAccountId?: number
  industryId?: number
  eventId?: number
  vehicleType: VehicleType
  marketRateType?: string
  marketRateTypeKey?: string
  vehicleTypeKey?: string
  marketplace?: boolean
  markupDays: MarkupDay[]
  startDate: string
  endDate: string
}

export interface MarkupDay {
  markupDayId?: number
  markupId?: number
  day: number
}

export interface MarkupResult extends ApiResult {
  markup: MarkupDetail
}
