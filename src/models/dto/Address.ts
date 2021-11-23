import dayjs from 'dayjs'

export interface Address {
  addressId: number
  name: string
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
  createdOn: dayjs.Dayjs
  updatedOn: dayjs.Dayjs
  lat: number
  lng: number
  timeZone: string
  title?: string
  nearestMarketId: number
  companyId: number
  addressName: string
}
