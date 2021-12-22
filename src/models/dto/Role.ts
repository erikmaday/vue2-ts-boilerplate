import { ApiResult } from '.';
import { Permission } from './Permission'

export interface Role {
  roleId: number
  roleName: string
  permissions: Permission[]
}
export interface RoleResult extends ApiResult {
  roles: Role[]
  roleNames: string[]
}
