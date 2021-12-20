import { Permission } from './Permission'

export interface Role {
  roleId: number
  roleName: string
  permissions: Permission[]
}
