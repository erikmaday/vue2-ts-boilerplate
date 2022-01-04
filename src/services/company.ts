import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { GetCompanyResult } from '@/models/dto/Company'

const httpService: HttpService = new HttpService()

export default {
  getById(companyId: number): Promise<AxiosResponse<GetCompanyResult>> {
    const url = `https://${apiBaseUrl()}/companies/${companyId}`
    return httpService.get(url)
  },
}