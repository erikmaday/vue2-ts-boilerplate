import { AxiosResponse } from 'axios'
import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { TrackingPoint } from '@/models/dto/Tracking'

const httpService: HttpService = new HttpService()

export default {
  byReservationAndJourneyId(params: {
    reservationId: number
    journeyId: number
    skip: number
  }): Promise<AxiosResponse<TrackingPoint[]>> {
    const { reservationId = null, journeyId = null, skip = 10 } = params
    const host = apiBaseUrl('tracking')
    const url = `https://${host}/trip_detail/${reservationId}/${journeyId}?skip=${skip}`
    return httpService.get(url)
  },
}
