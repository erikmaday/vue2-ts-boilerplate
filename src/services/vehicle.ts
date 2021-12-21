import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Vehicle } from '@/models/dto/Vehicle'
import { VehicleResult } from '@/models/dto/VehicleResult'
import { ApiResult } from '@/models/dto'

const httpService: HttpService = new HttpService()

export default {
  tableView(params: TableViewParameters): Promise<AxiosResponse<TableViewResult<Vehicle>>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params
    return httpService.get(
      `https://${apiBaseUrl()}/tables/vehicles?${
        (pageSize ? `pageSize=${pageSize}` : '') +
        (page ? `&page=${page}` : '') +
        (sorts ? `&${sorts}` : '') +
        (filters ? `&${filters}` : '')
      }`
    )
  },
  byId(vehicleId: number): Promise<AxiosResponse<VehicleResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v2/vehicles/${vehicleId}`)
  },
  delete(vehicleId: number): Promise<AxiosResponse<ApiResult>> {
    return httpService.delete(
      `https://${apiBaseUrl()}/v2/vehicles/${vehicleId}`
    )
  },
}
