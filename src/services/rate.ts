import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Rate } from '@/models/dto/Rate'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<Rate>>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params
    return httpService.get(
      `https://${apiBaseUrl()}/tables/market-rates?${
        (pageSize ? `pageSize=${pageSize}` : '') +
        (page ? `&page=${page}` : '') +
        (sorts ? `&${sorts}` : '') +
        (filters ? `&${filters}` : '')
      }`
    )
  },
  create(payload) {
    const url = `https://${apiBaseUrl()}/v2/market-rates`
    return httpService.post(url, payload)
  },
  delete(marketRateId: number) {
    const url = `https://${apiBaseUrl()}/v2/market-rates/${marketRateId}`
    return httpService.delete(url)
  },
  update(payload) {
    const url = `https://${apiBaseUrl()}/v2/market-rates/${payload.marketRateId}`
    return httpService.patch(url, payload)
  },
}
