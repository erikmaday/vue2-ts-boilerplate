import { ApiResult, Reservation, Vehicle, VehicleAssignment } from ".";

export interface AvailabilityGetRequest {
  startDatetime: string
  endDatetime: string
}

export interface AvailabilityGetResponse extends ApiResult {
  reservations: Reservation[]
}

export interface AvailabilityBlock {
  reservationId: number
  vehicleAssignments: VehicleAssignment[]
  startDate: string | Date
  endDate: string | Date
  firstStop: string
  lastStop: string
  isMultiStop: boolean
}

export interface VehicleBlockItem {
  blocks: AvailabilityBlock[]
  vehicle: Vehicle | string
  startingHeight?: number
}

export interface VehicleKeyRow {
  rowHeight: number
  vehicle: Vehicle | UnassignedVehicle | undefined
}

export interface UnassignedVehicle {
  vehicleName: string
  vehicleId: number
}
