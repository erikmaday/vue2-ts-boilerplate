import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { User } from '@/models/dto/User'
import { UserApiResult } from '@/models/dto/UserApiResult'

const httpService: HttpService = new HttpService()

export default {
  tableView({
    pageSize,
    page,
    sorts,
    filters,
  }: TableViewParameters): Promise<AxiosResponse<TableViewResult<User>>> {
    return httpService.get(
      `https://${apiBaseUrl()}/tables/users?${
        (pageSize ? `pageSize=${pageSize}&` : '') +
        (page ? `page=${page}&` : '') +
        (sorts ? `${sorts}&` : '') +
        (filters ? `${filters}` : '')
      }`
    )
  },
  byId(userId: number): Promise<AxiosResponse<UserApiResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v2/drivers/${userId}`)
  },
  delete(userId: number): Promise<AxiosResponse> {
    return httpService.delete(`https://${apiBaseUrl()}/v3/drivers/${userId}`)
  },
}
