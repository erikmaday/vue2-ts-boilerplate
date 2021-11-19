import dayjs from 'dayjs'

export type Address = {
  addressId?: number
  name: string
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
  createdOn?: dayjs.Dayjs
  updatedOn?: dayjs.Dayjs
  lat?: string | number
  lng?: string | number
  timeZone?: string
  title?: string
  nearestMarketId?: number
  companyId?: number
}
