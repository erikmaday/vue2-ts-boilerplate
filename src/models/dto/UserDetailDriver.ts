import { ApiResult, SupportedVehicleType, Group, UserDetail } from '.'

export interface UserDetailDriver extends UserDetail {
  drugTestNumber: string
  drugTestExpiration?: string
  drugTestExpirationMonth?: number
  drugTestExpirationYear?: number
  group?: Group
  isSignedUp?: boolean
  licensState: string
  licenseNumber: string
  licenseExpirationMonth: number
  licenseExpirationYear: number
  phoneNumber: string
  notes?: string
  timeZone?: string
  driverSupportedVehicles: SupportedVehicleType[]
}

export interface DriverResult extends ApiResult {
  driver: UserDetailDriver
}
