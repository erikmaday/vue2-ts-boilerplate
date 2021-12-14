import { ApiResult } from './ApiResult'
import { VehicleAssignment } from './VehicleAssignment'

export interface TripAssignmentListResult extends ApiResult {
  vehicleAssignments: VehicleAssignment[]
}
