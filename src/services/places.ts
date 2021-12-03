import { apiBaseUrl } from '@/utils/env'
import { Place, PlaceSearch } from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'

const httpService: HttpService = new HttpService()

export default {
  bySearchTerm(term: string): Promise<AxiosResponse<PlaceSearch[]>> {
    const url = `https://${apiBaseUrl()}/places?term=${term}`
    return httpService.get(url)
  },
  byId(placeId: string): Promise<AxiosResponse<Place>> {
    const url = `https://${apiBaseUrl()}/places/${placeId}`
    return httpService.get(url)
  },
}
