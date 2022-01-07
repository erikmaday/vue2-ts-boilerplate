import { apiBaseUrl } from '@/utils/env'
import { TableViewParameters } from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { BidPayload, BidTableViewResult } from '@/models/dto/Bid'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<BidTableViewResult>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params

    let query = `page=${page}&pageSize=${pageSize}`
    if (sorts) {
      query += `&${sorts}`
    }
    if (filters) {
      query += `&${filters}`
    }
    query = encodeURI(query)
    const host = apiBaseUrl()
    const url = `https://${host}/tables/bids?${query}`
    return httpService.get(url)
  },
  create(payload: BidPayload): Promise<AxiosResponse<number>> {
    const host = apiBaseUrl()
    const url = `https://${host}/v2/bids`
    return httpService.post<number, BidPayload>(url, payload)
  },
  update(bidId: number, payload: BidPayload): Promise<AxiosResponse<number>> {
    const host = apiBaseUrl()
    const url = `https://${host}/v2/bids/${bidId}`
    return httpService.patch<number, BidPayload>(url, payload)
  },
}
