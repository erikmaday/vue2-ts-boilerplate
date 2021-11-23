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
