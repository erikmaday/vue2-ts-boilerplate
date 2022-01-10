import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { UserDetail, UserResult } from '@/models/dto'
import { RoleResult } from '@/models/dto/Role'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<UserDetail>>> {
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

    return httpService.get(`https://${host}/tables/users?${query}`)
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
  changePassword(
    userId: number,
    new_password: string,
    password: string
  ): Promise<AxiosResponse<UserResult>> {
    return httpService.post(`https://${apiBaseUrl()}/users/set-password/`, {
      id: String(userId),
      new_password,
      password,
    })
  },
  setPasswordWithHash(
    hash: string,
    password: string
  ): Promise<AxiosResponse<UserResult>> {
    const url = `https://${apiBaseUrl()}/password/reset`
    return httpService.post(url, { hash, password })
  },
  validateUser(hash: string): Promise<AxiosResponse<UserDetail>> {
    const url = `https://${apiBaseUrl()}/user/validate`
    return httpService.post(url, { userHash: hash })
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
