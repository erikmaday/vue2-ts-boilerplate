import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { DriverResult, UserDetailDriver } from '@/models/dto/UserDetailDriver'
import { TableViewParameters, TableViewResult } from '@/models/dto'
import { Driver } from '@/models/dto/Driver'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<Driver>>> {
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

    return httpService.get(`https://${host}/tables/drivers?${query}`)
  },
  byId(userId: number): Promise<AxiosResponse<DriverResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
  },
  create(driver: UserDetailDriver): Promise<AxiosResponse<DriverResult>> {
    return httpService.post(`https://${apiBaseUrl()}/v3/drivers`, driver)
  },
  makeDriver(userId: number): Promise<AxiosResponse> {
    // No response is sent back from this endpoint
    return httpService.get(
      `https://${apiBaseUrl()}/v3/drivers/makeDriver/${userId}`
    )
  },
  deactivateDriver(userId: number): Promise<AxiosResponse> {
    return httpService.get(
      `https://${apiBaseUrl()}/drivers/deactivate/${userId}`
    )
  },
  update(
    userId: number,
    driver: UserDetailDriver
  ): Promise<AxiosResponse<string>> {
    return httpService.put(
      `https://${apiBaseUrl()}/v3/drivers/${userId}`,
      driver
    )
  },
}
