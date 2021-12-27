import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { UserDetail, UserResult } from '@/models/dto'
import { RoleResult } from '@/models/dto/Role'

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
  roles(userId: number): Promise<AxiosResponse<RoleResult>> {
    const host = apiBaseUrl()
    const url = `https://${host}/user/roles/${userId}`

    return httpService.get(url)
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
  create(user: UserDetail): Promise<AxiosResponse<number>> {
    return httpService.post(`https://${apiBaseUrl()}/user`, user)
  },
  checkIfEmailExists(
    email: string
  ): Promise<AxiosResponse<{ exists: boolean }>> {
    return httpService.get(`https://${apiBaseUrl()}/users/check-email/${email}`)
  },
  update(userId: number, user: UserDetail): Promise<AxiosResponse<string>> {
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
