export interface Rate {
  companyId: number
  companyName?: string
  highRate: number
  hourlyMinimum: number
  lowRate: number
  marketId: number
  marketRateId: number
  marketplace: number
  vehicleId?: number
  vehicleName?: string
  vehicleType: string
  vehicleTypeId: number
}

export interface RateTableRow extends Rate {
  isEditable?: boolean
  isNewRow?: boolean
}