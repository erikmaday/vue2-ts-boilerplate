import { apiBaseUrl } from '@/utils/env'
import { TripAssignmentListResult } from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'

const httpService: HttpService = new HttpService()

interface ReservationIdPayload {
  reservationIds: number[]
}

export default {
  byReservationIds(
    reservationIds: number[]
  ): Promise<AxiosResponse<TripAssignmentListResult>> {
    const payload = { reservationIds }
    const host = apiBaseUrl()
    const url = `https://${host}/tripAssignments/reservation`
    return httpService.post<TripAssignmentListResult, ReservationIdPayload>(
      url,
      payload
    )
  },
}
