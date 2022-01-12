import { Stop } from './Stop'
import { Address } from './Address'
import { Vehicle, VehicleType } from './Vehicle'
import { DriverAssignment } from './DriverAssignment'

export interface VehicleAssignment {
  active: boolean
  createdOn: string
  driverAssignments?: DriverAssignment[]
  endDatetime: string
  firstAddress: Address
  firstAddressId: number
  firstStop?: Stop | null
  firstStopId?: number | null
  lastAddress: Address
  lastAddressId: number
  lastStop: Stop
  lastStopId: number
  reservationId: number
  startDatetime: string
  tripAssignmentId: number
  updatedOn?: string
  vehicle: Vehicle
  vehicleId: number
  vehicleType: VehicleType
  vehicleTypeId: number
  vehicleTypeLabel?: string
}
