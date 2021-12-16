import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { User } from '@/models/dto/User'
import { UserResult } from '@/models/dto/UserResult'

const httpService: HttpService = new HttpService()

export const getVehicleTypes = (params: TableViewParameters) => {
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
}
