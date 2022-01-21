import { ApiResult } from "./dto";

export interface EldCredential {
  eldCredentialsId?: number
  accessToken: string
  eldCredentialTypeId: number
  companyId: number
}

export interface GetEldCredentialResponse extends ApiResult {
  eldCredentials: EldCredential[]
}
