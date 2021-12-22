import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { DriverResult, UserDetailDriver } from '@/models/dto/UserDetailDriver'

const httpService: HttpService = new HttpService()

export default {
  byId(userId: number): Promise<AxiosResponse<DriverResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
  },
  create(driver: UserDetailDriver): Promise<AxiosResponse<DriverResult>> {
    return httpService.post(`https://${apiBaseUrl()}/v3/drivers`, driver)
  },
  makeDriver(userId: number): Promise<AxiosResponse> { // No response is sent back from this endpoint 
    return httpService.get(`https://${apiBaseUrl()}/v3/drivers/makeDriver/${userId}`)
  },
  deactivateDriver(userId: number): Promise<AxiosResponse> {
    return httpService.get(`https://${apiBaseUrl()}/drivers/deactivate/${userId}`)
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