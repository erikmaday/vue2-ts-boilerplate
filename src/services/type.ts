import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { AxiosResponse } from 'axios'
import { VehicleType } from '@/models/dto'
import { AmenityType } from '@/models/dto/Amenity'

const httpService: HttpService = new HttpService()

export default {
  vehicleTypeTableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<VehicleType>>> {
    const { pageSize = 10, page = 1, sorts = null, filters = null } = params
    let query = `page=${page}&pageSize=${pageSize}`
    if (sorts) {
      query += `&${sorts}`
    }
    if (filters) {
      query += `&${filters}`
    }
    query = encodeURI(query)

    const host = apiBaseUrl()
    const url = `https://${host}/tables/vehicleTypes?${query}`

    return httpService.get(url)
  },

  amenity(): Promise<AxiosResponse<AmenityType>> {
    const host = apiBaseUrl()
    const url = `https://${host}/types/amenity-types`
    return httpService.get(url)
  },
}
