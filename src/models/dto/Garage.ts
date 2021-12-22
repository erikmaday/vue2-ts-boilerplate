import { Address, ApiResult } from '.'
import { Company } from './Company';

export interface Garage {
  garageName: string
  address: Address
  companyId: number
  defaultGarageNotes?: string
  garageId: number
  noOfVehicles: number
}

export interface CreateGarageRequest {
  address: Address
  defaultGarageNotes?: string
  garage: boolean
  name: string
  parentCompanyId: number
}

export interface GarageDetailResult extends ApiResult {
  garage: Garage
}

export interface CreateGarageResult extends ApiResult {
  company: Company
}
