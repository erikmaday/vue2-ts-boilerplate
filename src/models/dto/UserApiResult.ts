import { ApiResult, User } from '.'

export interface UserApiResult extends ApiResult {
  user: User
}
