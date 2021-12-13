import { Address } from '.'

export interface Garage {
  address: Address
  companyId: number
  defaultGarageNotes?: string
  garageId: number
  garageName: string
  noOfVehicles: number
}
