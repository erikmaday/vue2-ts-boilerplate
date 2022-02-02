import { Type } from './Type'

export interface Rate {
  companyId: number
  companyName?: string
  highRate: number
  hourlyMinimum: number
  lowRate: number
  marketId: number
  marketRateType: string
  marketRateId: number
  marketplace: number
  vehicleId?: number
  vehicleName?: string
  vehicleType: string
  vehicleTypeId: number
}

// Technically extends RateMapItem, but not indexable by string
// Represents the object passed to v-data-table, rather than just
// a compliation of all rates associated with a vehicleType
export interface RateTableRow {
  dailyRate: RateTableRowRate
  deadMileRate: RateTableRowRate
  hourlyMinimum: RateTableRowRate
  hourlyRate: RateTableRowRate
  mileageRate: RateTableRowRate
  transferRate: RateTableRowRate
  isEditable?: boolean
  isNewRow?: boolean
  items?: unknown[]
  vehicleType: string
}
export interface RateMapItem {
  [index: string]: RateTableRowRate
  dailyRate: RateTableRowRate
  deadMileRate: RateTableRowRate
  hourlyMinimum: RateTableRowRate
  hourlyRate: RateTableRowRate
  mileageRate: RateTableRowRate
  transferRate: RateTableRowRate
}
export interface RateTableRowRate {
  companyId?: number
  marketId?: number
  marketRateId?: number
  marketRateType?: string
  marketplace?: number
  value: number
  vehicleTypeId?: number
}

// Requests
export interface CreateRatePayload {
  companyId: number
  highRate: number | string
  lowRate: number | string
  marketId?: number
  marketRateType: string
  marketRateTypeKey: string
  marketplace: number
  vehicleTypeKey: string
  vehicleId?: number | null
}
export interface UpdateRatePayload {
  companyId: number
  highRate: number | string
  lowRate: number | string
  marketId: number
  marketRateType: string
  marketRateTypeKey: string
  marketplace: number
  vehicleTypeKey: string
  vehicleId?: number | null
}

export interface MarketRateType extends Type {
  companyId?: number
  active?: boolean
  id?: number
}
