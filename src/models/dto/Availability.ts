import { ApiResult, Reservation } from ".";

export interface AvailabilityGetRequest {
  startDatetime: string
  endDatetime: string
}

export interface AvailabilityGetResponse extends ApiResult {
  reservations: Reservation[]
}