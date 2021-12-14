import { VehicleType } from './Vehicle'
import { Type } from './Type'
import { Address } from './Address'

export interface ReservationDetail {
  reservationId: number
  companyId: number
  managedId: string
  hash: string
  reservationReview?: any
  companyName: string
  parentCompanyName: string
  companyDBAName?: string
  referredCompanyId?: number
  customerFirstName?: string
  customerLastName?: string
  customerName: string
  customerPhoneNumber: string
  customerEmail: string
  customerId?: number
  tripContactFirstName?: string
  tripContactLastName?: string
  tripContactPhoneNumber?: any
  tripContactEmail?: string
  tripContactBookingsPerYear?: number
  tripContactId?: number
  tripContactCustomerAccount?: any
  tripContactOrganization?: any
  customerAccountCredits?: any
  parentReservationId: number
  checkoutName?: any
  leadSource?: any
  companyRating: number
  companyReviewCount: number
  reservationStatus: string
  paymentStatus: string
  referralStatus: string
  referralPaymentStatus: string
  referralPassengerCount: number
  referralId?: number
  reservationType: number
  createdOn: Date
  dueDate?: string
  quoteId?: any
  quoteManagedId?: string
  quoteCreatedOn?: string
  quoteCreatedBy?: string
  tripId: number
  tripType: string
  distance: number
  drivingTime: number
  driverCount: number
  calendarDays: number
  startDate: Date
  passengerCount?: number
  customerNotes: string
  isCharterUP: boolean
  company: ReservationDetailCompany
  companyNotes?: string
  amount: number
  originalAmount: number
  marketplaceClientTotal: number
  balance: number
  totalCredits?: any
  totalRefunds?: any
  companyCheckoutPageId?: number
  assignedDrivers: any[]
  requiredVehicles: ReservationDetailRequiredVehicle[]
  assignedVehicles: any[]
  referredTo?: any
  stops: ReservationDetailStop[]
  reservationComments: any[]
  reservationTickets?: any
  journeys: any[]
  transactions: any[]
  paymentsSummary: PaymentSummary[]
  companyAmenityDTO: CompanyAmenity[]
  companyPhotoDTO?: any
  vehiclePhotoCharterUpDTO?: any
  awardedTo: AwardedTo[]
  garageTimes?: any
  spotTimes: any[]
  parentSpotTimes: any[]
  isTrackingOdometry?: boolean
  signed: boolean
  signatureRequired: boolean
  routeName: string
  bookedBy: ReservationDetailBookedBy
  capturedInitialPayment: boolean
  ccVerifiedById?: number
  tripDescription: string
  tripNotes: string
  tripNotesList: any[]
  ccVerified: boolean
  hasTickets?: boolean
  active: boolean
  confirmed: boolean
  paid: boolean
  quoteLeadSourceType?: any
  requiredDrivers: number
  acceptanceStatusType: AcceptanceStatusType
  hasTrackingData: boolean
}

export interface AcceptanceStatusType extends Type {
  id: number
  companyId?: number
  active: boolean
}

export interface CompanyAmenity {
  amenityId: number
  amenityName: string
  isSupported: boolean
}

export interface ReservationDetailBookedBy {
  firstName: string
  lastName: string
  email: string
  groupName?: string
  companyName?: string
  groupId: number
  companyId: number
  linkedAccountProfileId?: number
  locale?: any
  driverInfoDTO?: any
  driverInfo?: any
  userPhotoDTOs?: any
  active: boolean
  isSDR: boolean
  isRA: boolean
}

export interface ReservationDetailCompanyType {
  companyTypeId: number
  companyTypeName?: string
}

export interface ReservationDetailPartnerType extends Type {
  partnerTypeId: number
}

export interface ReservationDetailCompany {
  name: string
  companyId: number
  address: Address
  email: string
  emailSenderName: string
  bccEmail?: string
  phone: string
  opsPhone: string
  fax: string
  dotNumber: string
  companyType: ReservationDetailCompanyType
  websiteUrl: string
  redirectPageUrl: string
  darkLogoUrl: string
  lightLogoUrl: string
  signatureRequired: boolean
  ticketCancellationRequired: boolean
  usabilityStatus: boolean
  checkoutTypeId: number
  defaultPreTripArrivalTime: string
  offeredCount: number
  acceptedCount: number
  rejectedCount: number
  shofurReservationCount: number
  vehicleCount: number
  parentCompanyId?: number
  garage: boolean
  active: boolean
  linkedAccountProfileId?: number
  socialLinks?: any
  ada: boolean
  spab: boolean
  partnerType: ReservationDetailPartnerType
  paymentMethod?: any
  isTrackingOdometry?: boolean
  preferred: boolean
}

export interface ReservationDetailRequiredVehicle {
  vehicleType: VehicleType
  quantity: number
  vehicleId?: number
}

export interface ReservationDetailStop {
  stopId: number
  tripId: number
  orderIndex: number
  address: Address
  notes?: string
  reached: boolean
  reachedTimeStamp?: string
  pickupDatetime?: Date
  dropoffDatetime?: Date
}

export interface PaymentSummary {
  entryType: number
  amount: number
  payment?: any
  charge: number
  balance: number
  createdOn: Date
  description: string
  meta?: string
  transactionType?: any
  transactionId?: number
  refundId?: number
  notes: string
  legacyNotes?: string
  refundProcess: boolean
  reservationId?: number
  companyId?: number
  netZero: boolean
  dueDate?: string
  convertedCreatedOn: Date
}

export interface AwardedTo {
  companyId: number
  name: string
}
