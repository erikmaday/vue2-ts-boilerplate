import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { GarageResult, Garage } from '@/models/dto/Garage'
import { GarageDetailResult } from '@/models/dto/Garage'
import { ApiResult } from '@/models/dto/ApiResult'

import { GarageRequest } from '@/models/dto/Garage'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<Garage>>> {
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

    return httpService.get(`https://${host}/tables/garages?${query}`)
  },
  byId(garageId: number): Promise<AxiosResponse<GarageDetailResult>> {
    return httpService.get(`https://${apiBaseUrl()}/garages/${garageId}`)
  },
  delete(garageId: number): Promise<AxiosResponse<ApiResult>> {
    return httpService.delete(`https://${apiBaseUrl()}/garages/${garageId}`)
  },
  create(garage: GarageRequest): Promise<AxiosResponse<GarageResult>> {
    return httpService.post(`https://${apiBaseUrl()}/companies/create`, garage)
  },
  update(
    garage: GarageRequest,
    garageId: number
  ): Promise<AxiosResponse<GarageResult>> {
    return httpService.patch(
      `https://${apiBaseUrl()}/companies/${garageId}`,
      garage
    )
  },
}
