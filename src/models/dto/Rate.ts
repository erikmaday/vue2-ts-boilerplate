export interface Rate {
  companyId: number
  companyName?: string
  highRate: number
  hourlyMinimum: number
  lowRate: number
  marketId: number
  marketRateType?: string
  marketRateId: number
  marketplace: number
  vehicleId?: number
  vehicleName?: string
  vehicleType: string
  vehicleTypeId: number
}

export interface RateMapItem extends Rate {
  isEditable?: boolean
  isNewRow?: boolean
}
export interface RateTableRow {
  dailyRate: RateTableRowRate
  deadMileRate: RateTableRowRate
  hourlyMinimum: RateTableRowRate
  hourlyRate: RateTableRowRate
  isEditable?: boolean
  isNewRow?: boolean
  mileageRate: RateTableRowRate
  transferRate: RateTableRowRate
  vehicleType: string
  vehicleTypeId: number
  companyId?: number
  vehicleName?: string
  companyName?: string
  marketId?: number
  marketRateType?: string
  marketRateId?: number
  marketplace: number
  vehicleId?: number
  highRate?: number
  lowRate?: number
}

export interface RateTableRowRate {
  companyId: number
  marketId: number
  marketRateId: number
  marketRateType: string
  marketplace: number
  value: number
}

export interface CreateRatePayload {
  companyId: number
  highRate: number | string
  lowRate: number | string
  marketId: number
  marketRateType: string
  marketRateTypeKey: string 
  marketplace: number
  vehicleType?: string
  vehicleId?: number | null
}