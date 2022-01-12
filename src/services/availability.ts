import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import {
  AvailabilityGetRequest,
  AvailabilityGetResponse,
} from '@/models/dto/Availability'

const httpService: HttpService = new HttpService()

export default {
  getData(
    dates: AvailabilityGetRequest
  ): Promise<AxiosResponse<AvailabilityGetResponse>> {
    return httpService.post(
      `https://${apiBaseUrl()}/tripAssignments/getDispatchView`,
      dates
    )
  },
}
