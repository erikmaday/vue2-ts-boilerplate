// Reservation object with less data

import { VehicleAssignment } from "./dto";

// Should this go in Reservation.ts?
export interface AvailabilityBlock {
  reservationId: number
  vehicleAssignments: VehicleAssignment[]
  startDatetime: string | Date
  endDatetime: string | Date
  firstStop: string
  lastStop: string
  isMultiStop: boolean
}