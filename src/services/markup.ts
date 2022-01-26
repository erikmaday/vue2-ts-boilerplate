import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Markup, MarkupResult } from '@/models/dto/Markup'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<Markup>>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params
    return httpService.get(
      `https://${apiBaseUrl()}/tables/markups?${
        (pageSize ? `pageSize=${pageSize}` : '') +
        (page ? `&page=${page}` : '') +
        (sorts ? `&${sorts}` : '') +
        (filters ? `&${filters}` : '')
      }`
    )
  },
  byId(markupId: number): Promise<AxiosResponse<MarkupResult>> {
    return httpService.get(`https://${apiBaseUrl()}/markup/${markupId}`)
  },
  addMarkup(markup: Markup): Promise<AxiosResponse<MarkupResult>> {
    return httpService.post(`https://${apiBaseUrl()}/markup`, markup)
  },
  editMarkup(markup: Markup): Promise<AxiosResponse<MarkupResult>> {
    return httpService.patch(
      `https://${apiBaseUrl()}/markup/${markup.markupId}`,
      markup
    )
  },
  deleteMarkup(markupId: number): Promise<AxiosResponse> {
    return httpService.delete(`https://${apiBaseUrl()}/markup/${markupId}`)
  },
}
