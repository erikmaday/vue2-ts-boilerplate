import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { UserDetail, UserDetailDriver } from '@/models/dto/User'
import { UserResult } from '@/models/dto/UserResult'
import { RoleResult } from '@/models/dto/RoleResult'
import { DriverResult } from '@/models/dto/DriverResult'
import { ApiResult } from '@/models/dto/ApiResult'
import { UserPhotoRequest } from '@/models/dto/UserPhotoRequest'

const httpService: HttpService = new HttpService()

export default {
  tableView({
    pageSize,
    page,
    sorts,
    filters,
  }: TableViewParameters): Promise<AxiosResponse<TableViewResult<UserDetail>>> {
    return httpService.get(
      `https://${apiBaseUrl()}/tables/users?${
        (pageSize ? `pageSize=${pageSize}&` : '') +
        (page ? `page=${page}&` : '') +
        (sorts ? `${sorts}&` : '') +
        (filters ? `${filters}` : '')
      }`
    )
  },
  byId(userId: number): Promise<AxiosResponse<UserDetail>> {
    return httpService.get(`https://${apiBaseUrl()}/v2/drivers/${userId}`)
  },
  delete(userId: number): Promise<AxiosResponse> {
    return httpService.delete(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
  },
  getRoles(userId: number): Promise<AxiosResponse<RoleResult>> {
    const host = apiBaseUrl()
    const url = `https://${host}/user/roles/${userId}`

    return httpService.get(url)
  },
  getDriverById(userId: number): Promise<AxiosResponse<DriverResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
  },
  setPassword(
    userId: number,
    password: string
  ): Promise<AxiosResponse<UserResult>> {
    return httpService.post(
      `https://${apiBaseUrl()}/users/admin-set-password/`,
      {
        id: String(userId),
        password,
      }
    )
  },
  createUser(user: UserDetail): Promise<AxiosResponse<number>> {
    return httpService.post(`https://${apiBaseUrl()}/user`, user)
  },
  createDriver(driver: UserDetailDriver): Promise<AxiosResponse<DriverResult>> {
    return httpService.post(`https://${apiBaseUrl()}/v3/drivers`, driver)
  },
  checkIfEmailExists(
    email: string
  ): Promise<AxiosResponse<{ exists: boolean }>> {
    return httpService.get(`https://${apiBaseUrl()}/users/check-email/${email}`)
  },
  makeDriver(userId: number): Promise<AxiosResponse> { // No response is sent back from this endpoint 
    return httpService.get(`https://${apiBaseUrl()}/v3/drivers/makeDriver/${userId}`)
  },
  deactivateDriver(userId: number): Promise<AxiosResponse> {
    return httpService.get(`https://${apiBaseUrl()}/drivers/deactivate/${userId}`)
  },
  updateDriver(
    userId: number,
    driver: UserDetailDriver
  ): Promise<AxiosResponse<string>> {
    return httpService.put(
      `https://${apiBaseUrl()}/v3/drivers/${userId}`,
      driver
    )
  },
  updateUser(userId: number, user: UserDetail): Promise<AxiosResponse<string>> {
    return httpService.patch(`https://${apiBaseUrl()}/user/${userId}`, user)
  },
  uploadUserPhoto(
    userId: number,
    photo: FormData
  ): Promise<AxiosResponse<boolean>> {
    return httpService.post(
      `https://${apiBaseUrl()}/v2/photos/users/${userId}/userPhotos`,
      photo
    )
  },
}
