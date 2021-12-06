import { apiBaseUrl } from '@/utils/env'
import {
  UserAuthResult,
  UserAuthPayload,
  UserProfileResult,
} from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'

const httpService: HttpService = new HttpService()

export default {
  // tableView(params: UserAuthPayload): Promise<AxiosResponse<UserAuthResult>> {
  //   const {
  //     // companyId,
  //     // referrals,
  //     sorts,
  //     filters,
  //     pageSize = 10,
  //     page = 1,
  //   } = params

  //   // TODO: implement the referrals tv endpoint
  //   // TODO: implement the filters/sorts util
  //   // TODO: determine how to easily pass filters and sorts

  //   const url = `https://${apiBaseUrl()}/auth/`
  //   return httpService.post<UserAuthResult, UserAuthPayload>(url, payload)
  // },
  getUserProfile(): Promise<AxiosResponse<UserProfileResult>> {
    const url = `https://${apiBaseUrl()}/userProfile`
    return httpService.get(url)
  },
}

// reservationsTableView(store, params) {
//   const {
//     // companyId,
//     // referrals,
//     sorts,
//     filters,
//     pageSize = 10,
//     page = 1,
//   } = params

//   const params = {
//     sorts,
//     filters,
//     // pageSize: this.itemsPerPage,
//     // page: this.currentPage,
//   }
//   // keep this one around ...
//   // let query = `companyId=${companyId}&referrals=${referrals}&page=${page}&pageSize=${pageSize}`

//   let query = `page=${page}&pageSize=${pageSize}`
//   if (sorts) {
//     query += `&${sorts}`
//   }
//   if (filters) {
//     query += `&${filters}`
//   }
//   query = encodeURI(query)
//   const host = baseUrl()
//   const url = `https://${host}/tables/referrals?${query}`
//   let options = {
//     headers: { 'Cache-Control': 'private, no-cache, no-store, max-age=0' },
//   }
//   return axios.get(url, options)
// },
