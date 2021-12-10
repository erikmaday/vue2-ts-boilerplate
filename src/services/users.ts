import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { User } from '@/models/dto/User'

const httpService: HttpService = new HttpService()

export const usersTableView = async ({
  pageSize,
  page,
  sorts,
  filters,
}: TableViewParameters): Promise<AxiosResponse<TableViewResult<User>>> => {
  return httpService.get(
    `https://${apiBaseUrl()}/tables/users?${
      (pageSize ? `pageSize=${pageSize}&` : '') +
      (page ? `page=${page}&` : '') +
      (sorts ? `${sorts}` : '') +
      (filters ? `${filters}` : '')
    }`
  )
}

export const getUser = async (userId: number): Promise<AxiosResponse> => {
  return httpService.get(`https://${apiBaseUrl()}/v2/drivers/${userId}`)
}

export const deleteUser = async (userId: number): Promise<AxiosResponse> => {
  return httpService.delete(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
}
