import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { ApiResult } from '@/models/dto/ApiResult'
import { AxiosResponse } from 'axios'
import { EldCredential, GetEldCredentialResponse } from '@/models/EldCredential'

const httpService: HttpService = new HttpService()


export default {
  getAll(): Promise<AxiosResponse<GetEldCredentialResponse>> {
    const url = `http://localhost:8084/credentials?actorCompanyId=11666`
    return httpService.get(url)
  },
  create(eldCredential: EldCredential) {
    const url = `https://${apiBaseUrl()}/credentials`
    return httpService.post(url, eldCredential)
  },
  update(eldCredential: EldCredential) {
    const url = `https://${apiBaseUrl()}/credentials`
    return httpService.patch(url, eldCredential)
  },
}