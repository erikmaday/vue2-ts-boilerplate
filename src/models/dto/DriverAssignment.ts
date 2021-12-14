import { Address } from './Address'
import { Stop } from './Stop'
import { Driver } from './Driver'

export interface DriverAssignment {
  active: boolean
  createdOn: string
  driver: Driver
  endDatetime: string
  firstAddress: Address
  firstAddressId: number
  firstStop?: Stop
  firstStopId?: number
  lastAddress: Address
  lastAddressId: number
  lastStop: Stop
  lastStopId: number
  reservationId: number
  startDatetime: string
  tripAssignmentId: number
  updatedOn?: string
  userId: number
  vehicleAssignmentId: number
}
