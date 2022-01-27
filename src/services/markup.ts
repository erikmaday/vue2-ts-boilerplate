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
    const { sorts = null, filters = null, pageSize = 10, page = 1 } = params

    let query = `page=${page}&pageSize=${pageSize}`
    if (sorts) {
      query += `&${sorts}`
    }
    if (filters) {
      query += `&${filters}`
    }
    query = encodeURI(query)
    const host = apiBaseUrl()
    const url = `https://${host}/tables/markups?${query}`
    return httpService.get(url)
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
