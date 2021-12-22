import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { CreateGarageResult, Garage } from '@/models/dto/Garage'
import { GarageDetailResult } from '@/models/dto/Garage'
import { ApiResult } from '@/models/dto/ApiResult'

import { CreateGarageRequest } from '@/models/dto/Garage'

const httpService: HttpService = new HttpService()

export default {
  tableView(params: TableViewParameters): Promise<AxiosResponse<TableViewResult<Garage>>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params
    return httpService.get(
      `https://${apiBaseUrl()}/tables/garages?${
        (pageSize ? `pageSize=${pageSize}` : '') +
        (page ? `&page=${page}` : '') +
        (sorts ? `&${sorts}` : '') +
        (filters ? `&${filters}` : '')
      }`
    )
  },
  byId(garageId: number): Promise<AxiosResponse<GarageDetailResult>> {
    return httpService.get(`https://${apiBaseUrl()}/garages/${garageId}`)
  },
  delete(garageId: number): Promise<AxiosResponse<ApiResult>> {
    return httpService.delete(`https://${apiBaseUrl()}/garages/${garageId}`)
  },
  create(
    garage: CreateGarageRequest
  ): Promise<AxiosResponse<CreateGarageResult>> {
    return httpService.post(`https://${apiBaseUrl()}/companies/create`, garage)
  }
}
