import { ApiResult, UserDetail } from '.'

export interface UserResult extends ApiResult {
  user: UserDetail
}
