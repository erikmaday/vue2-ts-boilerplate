import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { ApiResult } from '@/models/dto/ApiResult'
import { AxiosResponse } from 'axios'
import { EldCredential, GetEldCredentialResponse } from '@/models/EldCredential'

const httpService: HttpService = new HttpService()

export default {
  getAll(): Promise<AxiosResponse<GetEldCredentialResponse>> {
    const url = `https://${apiBaseUrl()}/credentials`
    return httpService.get(url)
  },
  create(eldCredential: EldCredential): Promise<AxiosResponse<ApiResult>> {
    const url = `https://${apiBaseUrl()}/credentials`
    return httpService.post(url, eldCredential)
  },
  update(eldCredential: EldCredential): Promise<AxiosResponse<ApiResult>> {
    const url = `https://${apiBaseUrl()}/credentials`
    return httpService.patch(url, eldCredential)
  },
}
