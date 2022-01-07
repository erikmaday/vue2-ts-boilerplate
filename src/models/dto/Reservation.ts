import { VehicleAssignment } from '.'
import { TableViewResult } from './TableView'
export interface Reservation {
  reservationId: number
  managedId: number
  amount: number
  referredAmount: number
  referralStatusKey: string | null
  referralStatus: string
  paymentStatus: string
  referralPaymentStatus: string
  balance: number
  cancelledOn: string | null
  active: boolean
  grossProfit: number
  assignedDriverPercentage: number
  assignedVehiclePercentage: number
  createdOn: string
  driverInfoEmailSent: boolean
  sentDate: string
  firstSentDate: string | null
  customerName: string
  bookedByName: string
  customerEmail: string
  customerAccountName: null
  contractId: number | null
  managedContractId: string | null
  quoteManagedId: number
  referringCompany: string
  pickupLocation: string
  pickupDate: string
  dropoffDate: string
  firstPickupTimeZone: string
  firstPickupAddressName: string
  firstDropoffAddressName: string
  tripTypeLabel: string
  distance: number
  drivingTime: number
  openForBid: boolean
  dueDate: string | null
  customerTotal: number
  marketplaceClientTotal: number | null
  reservationStatusKey: string | null
  reservationStatus: string
  ccVerified: boolean
  confirmed: boolean
  parentReservationId: number | null
  reservationType: number
  requiredDrivers: null
  referralId: null
  referralPassengerCount: number | null
  quotedOn: null
  enterpriseTrackingOnly: null
  tripId: number
  childId: null
  hash: string | null
  checkoutPageId: null
  vehicleAssignments: VehicleAssignment[]
  charterUpQuote: boolean
}

export type ReservationTableViewResult = TableViewResult<Reservation>
