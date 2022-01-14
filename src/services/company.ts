import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { Company, CompanyResult } from '@/models/dto/Company'

const httpService: HttpService = new HttpService()

export default {
  byId(companyId: number): Promise<AxiosResponse<CompanyResult>> {
    const url = `https://${apiBaseUrl()}/companies/${companyId}`
    return httpService.get(url)
  },
  update(companyId: number, company: Company): Promise<AxiosResponse<string>> {
    return httpService.patch(
      `https://${apiBaseUrl()}/companies/${companyId}`,
      company
    )
  },
  getCompanyPhoto(companyId: number): Promise<AxiosResponse> {
    return httpService.get(
      `https://${apiBaseUrl()}/v2/companies/${companyId}/companyPhotos`
    )
  },
  uploadCompanyPhoto(
    companyId: number,
    photo: FormData
  ): Promise<AxiosResponse<boolean>> {
    return httpService.post(
      `https://${apiBaseUrl()}/v2/photos/companies/${companyId}/companyPhotos`,
      photo
    )
  },
  uploadBranding(
    companyId: number,
    type: string,
    photo: FormData
  ): Promise<AxiosResponse<boolean>> {
    const url = `https://${apiBaseUrl()}/v2/photos/companies/${companyId}/companyBrandings/${type}`
    return httpService.post(url, photo)
  },
}
