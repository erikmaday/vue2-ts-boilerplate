import { Address, ApiResult } from '.'
import { Company } from './Company';

export interface Garage {
  garageName: string
  address?: Address
  addressDTO?: Address
  companyId: number
  defaultGarageNotes?: string
  garageId: number
  noOfVehicles: number
}

export interface GarageRequest {
  address: Address
  defaultGarageNotes?: string
  garage: boolean
  name: string
  parentCompanyId: number
}

export interface GarageDetailResult extends ApiResult {
  garage: Garage
}

export interface GarageResult extends ApiResult {
  company: Company
}
