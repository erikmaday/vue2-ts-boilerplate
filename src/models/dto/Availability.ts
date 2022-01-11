import { ApiResult, Reservation, Vehicle, VehicleAssignment,  } from ".";
import { Driver } from './Driver'
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
  vehiclesAreFullyAssigned: boolean
  driversAreFullyAssigned: boolean
  top?: number
}

export interface VehicleBlockItem {
  blocks: AvailabilityBlock[]
  vehicle: Vehicle | string
  startingHeight?: number
}

export interface DriverBlockItem {
  blocks: AvailabilityBlock[]
  driver: Driver | UnassignedDriver | string
  startingHeight?: number
}

export interface VehicleKeyRow {
  rowHeight: number
  vehicle: Vehicle | UnassignedVehicle | undefined
  distanceFromTop: number
}

export interface DriverKeyRow {
  rowHeight: number
  driver: Driver | UnassignedDriver 
  distanceFromTop: number
}

export interface UnassignedVehicle {
  vehicleName: string
  vehicleId: number
}

export interface UnassignedDriver {
  firstName: string
  lastName: string
  userId: number
}
