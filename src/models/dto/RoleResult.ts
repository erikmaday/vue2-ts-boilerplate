import { ApiResult, Role } from '.'

export interface RoleResult extends ApiResult {
  roles: Role[]
  roleNames: string[]
}
