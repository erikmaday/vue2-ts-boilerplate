import { Industry } from './Industry'

export interface Customer {
  customerId: number
  firstName: string
  lastName: string
  email: string
  customerAccountId?: any
  companyId: number
  industryId: number
  industryDescription?: any
  phone: string
  phoneExtension?: any
  fax?: any
  active: boolean
  isBlacklisted: boolean
  bookings: number
  organization: string
  notes?: any
  createdOn: Date
  updatedOn: Date
  customerAccount?: any
  company?: any
  id: number
  industry: Industry
}
