import { Address } from './Address'

export interface CompanyType {
  companyTypeId: number
  companyTypeName?: any
  key: string
}

export interface PartnerType {
  partnerTypeId: number
  key: string
  label: string
  description?: string
}

export interface SocialMediaType {
  id: number
  key: string
  label: string
  description?: string
  companyId?: number
  active: boolean
}

export interface SocialLink {
  companySocialLinkId: number
  uri: string
  companyId: number
  socialMediaTypeId: number
  socialMediaType: SocialMediaType
}

export interface Company {
  name: string
  companyId: number
  address: Address
  email: string
  emailSenderName: string
  phone: string
  opsPhone: string
  fax: string
  dotNumber: string
  broker: boolean
  isAdminCompany: boolean
  isClient: boolean
  hasTerms: boolean
  coachrailLimited: boolean
  companyType: CompanyType
  websiteUrl?: string
  redirectPageUrl: string
  darkLogoUrl: string
  lightLogoUrl: string
  signatureRequired: boolean
  ticketCancellationRequired: boolean
  usabilityStatus: boolean
  checkoutTypeId: number
  partnerType: PartnerType
  offeredCount: number
  acceptedCount: number
  rejectedCount: number
  shofurReservationCount: number
  driverCount: number
  parentCompanyId?: any
  garage: boolean
  active: boolean
  linkedAccountProfileId?: number
  socialLinks: SocialLink[]
  ada?: boolean
  spab?: boolean
  paymentMethod?: any
  isTrackingOdometry: boolean
  preferred: boolean
}
