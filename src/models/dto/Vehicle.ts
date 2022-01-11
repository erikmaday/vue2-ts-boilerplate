export type VehicleType = {
  id: number
  key: string
  label?: string
  description?: string
  active?: boolean
  companyId?: number | null
}

export type SupportedVehicleType = {
  vehicleTypeId: number
  supported?: boolean
  label?: string
}

export interface Vehicle {
  imagePath: string | null
  tripVehicleId: number
  tripId: number
  vehicleTypeId: number
  vehicleId: number
  quantity: number
  vehicleType: VehicleType
  vehicleTypeKey: string
}

export interface RequiredVehicleType {
  quantity: number
  vehicleId: number | null
  vehicleType: VehicleType
}
