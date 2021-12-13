import { ApiResult, User } from '.'

export interface UserResult extends ApiResult {
  user: User
}
