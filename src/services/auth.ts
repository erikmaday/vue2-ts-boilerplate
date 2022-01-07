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
  login(payload: UserAuthPayload): Promise<AxiosResponse<UserAuthResult>> {
    const url = `https://${apiBaseUrl()}/auth/cupops`
    return httpService.post<UserAuthResult, UserAuthPayload>(url, payload)
  },
  getUserProfile(): Promise<AxiosResponse<UserProfileResult>> {
    const url = `https://${apiBaseUrl()}/userProfile`
    return httpService.get(url)
  },
}
