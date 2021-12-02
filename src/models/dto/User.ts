import { ApiResult } from '.'
import { Company } from './Company'

export interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  groupName: string
  groupId: number
  companyId: number
  locale: string
  timeZone?: string
  companyName: string
  company: Company
  group: Group
  active: boolean
  isSignedUp: boolean
  userPhotoDTOs: UserPhoto[]
  userRoleNames: string[]
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
  user: User
}
