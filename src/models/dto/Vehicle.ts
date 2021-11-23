export type VehicleType = {
  id: number
  key: string
  label?: string
  description?: string
}

export interface Vehicle {
  tripVehicleId: number
  tripId: number
  vehicleTypeId: number
  vehicleId?: number
  quantity: number
  vehicleType: VehicleType
  vehicleTypeKey: string
}
