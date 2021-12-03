import { ApiResult } from '.'

export interface PlaceSearch {
  description: string
  place_id: string
  reference: string
}

export interface Place {
  addressName: string
  city: string
  completeAddress: string
  lat: number
  lng: number
  postalCode: string
  state: string
  street1: string
  timeZone: string
}
