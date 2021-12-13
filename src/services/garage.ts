import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Garage } from '@/models/dto/Garage'
import { GarageResult } from '@/models/dto/GarageResult'

const httpService: HttpService = new HttpService()

export default {
  tableView({
    pageSize,
    page,
    sorts,
    filters,
  }: TableViewParameters): Promise<AxiosResponse<TableViewResult<Garage>>> {
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
}
