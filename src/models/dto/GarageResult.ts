import { ApiResult } from '.'
import { Garage } from './Garage'

export interface GarageResult extends ApiResult {
  garage: Garage
}
