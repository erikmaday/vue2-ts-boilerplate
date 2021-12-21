import { ApiResult, SupportedVehicleType, VehicleType } from '.'
import { Company } from './Company'

export interface UserDetail {
  active: boolean
  userId?: number
  firstName: string
  lastName: string
  email: string
  groupId: number
  groupName?: string
  companyId: number
  companyName: string
  userPhotoDTOs: UserPhoto[]
  userRoleNames: string[]
  company?: Company
  linkedAccountProfileId?: number
  isRA?: boolean
  isSDR?: boolean
  locale: string
  treatAsDriver: boolean
}

export interface UserPhoto {
  userPhotoId: number
  userId: number
  imagePath: string
  primaryImage: boolean
  active: boolean
}

export interface Group {
  groupId: number
  label: string
  key: string
}

export interface UserProfile {
  groupId: number
  roles: Role[]
}

export interface UserProfileResult extends ApiResult {
  userProfile: UserProfile
}

export interface Role {
  roleId: number
  roleName: string
  permissions: Permission[]
}

export interface Permission {
  permissionId: number
  permissionName: string
}

export interface UserAuthPayload {
  email: string
  password: string
}
export interface UserAuthResult extends ApiResult {
  token: string
  user: UserDetail
}

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
