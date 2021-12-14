import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Vehicle } from '@/models/dto/Vehicle'
import { VehicleResult } from '@/models/dto/VehicleResult'

const httpService: HttpService = new HttpService()

export default {
  tableView({
    pageSize,
    page,
    sorts,
    filters,
  }: TableViewParameters): Promise<AxiosResponse<TableViewResult<Vehicle>>> {
    return httpService.get(
      `https://${apiBaseUrl()}/tables/vehicles?${
        (pageSize ? `pageSize=${pageSize}&` : '') +
        (page ? `page=${page}&` : '') +
        (sorts ? `${sorts}&` : '') +
        (filters ? `${filters}` : '')
      }`
    )
  },
  byId(vehicleId: number): Promise<AxiosResponse<VehicleResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v2/vehicles/${vehicleId}`)
  },
  delete(vehicleId: number): Promise<AxiosResponse> {
    return httpService.delete(
      `https://${apiBaseUrl()}/v2/vehicles/${vehicleId}`
    )
  },
}
