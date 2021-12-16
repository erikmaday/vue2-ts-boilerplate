import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Garage } from '@/models/dto/Garage'
import { GarageResult } from '@/models/dto/GarageResult'
import { ApiResult } from '@/models/dto/ApiResult'

const httpService: HttpService = new HttpService()

export default {
  tableView(params: TableViewParameters): Promise<AxiosResponse<TableViewResult<Garage>>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params
    return httpService.get(
      `https://${apiBaseUrl()}/tables/garages?${
        (pageSize ? `pageSize=${pageSize}&` : '') +
        (page ? `page=${page}&` : '') +
        (sorts ? `${sorts}&` : '') +
        (filters ? `${filters}` : '')
      }`
    )
  },
  byId(garageId: number): Promise<AxiosResponse<GarageResult>> {
    return httpService.get(`https://${apiBaseUrl()}/garages/${garageId}`)
  },
  delete(garageId: number): Promise<AxiosResponse<ApiResult>> {
    return httpService.delete(`https://${apiBaseUrl()}/garages/${garageId}`)
  },
}
