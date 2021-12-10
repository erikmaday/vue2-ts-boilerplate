import axios from 'axios'
import { apiBaseUrl } from '@/utils/env'
import { User } from '@/models/dto/User'
import { TableViewRequest } from '@/models/TableViewRequest'
import { HttpService } from '@/services/common/HttpService'
import { DataOptions } from 'vuetify'
import { AxiosResponse } from 'axios'

const httpService: HttpService = new HttpService()

export const usersTableView = async ({
  itemsPerPage,
  page,
  filters,
}: Partial<DataOptions>): Promise<AxiosResponse> => {
  return httpService.get(
    `https://${apiBaseUrl()}/tables/users?${
      (itemsPerPage ? `pageSize=${itemsPerPage}&` : '') +
      (page ? `page=${page}&` : '') +
      (filters ? `${filters}` : '')
    }`
  )
}

export const getUser = async (userId: number): Promise<unknown> => {
  return httpService.get(`https://${apiBaseUrl()}/v2/drivers/${userId}`)
}

export const deleteUser = async (userId: number): Promise<unknown> => {
  return httpService.delete(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
}