import { ApiResult, VehicleDetailEntity } from '.'

export interface VehicleResult extends ApiResult {
  vehicle: VehicleDetailEntity
}
