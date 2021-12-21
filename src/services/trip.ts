import { apiBaseUrl } from '@/utils/env'
import {
  TableViewParameters,
  TripResult,
  TripTableViewResult,
} from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters,
    filterNotBidOn = false,
    quoteIdList: string | null = null
  ): Promise<AxiosResponse<TripTableViewResult>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params

    let query = `page=${page}&pageSize=${pageSize}`
    if (sorts) {
      query = `${query}&${sorts}`
    }
    if (filters) {
      query = `${query}&${filters}`
    }
    if (filterNotBidOn) {
      query = `${query}&filterNotBidOn=true`
    }
    if (quoteIdList) {
      query = `${query}&quoteId=${quoteIdList}`
    }
    query = encodeURI(query)
    const host = apiBaseUrl()
    const url = `https://${host}/tables/trips?${query}`
    return httpService.get(url)
  },
  byId(id: number): Promise<AxiosResponse<TripResult>> {
    const host = apiBaseUrl()
    const url = `https://${host}/v3/trips/${id}`
    return httpService.get(url)
  },
}
