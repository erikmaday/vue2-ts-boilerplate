import { ApiResult, UserDetailDriver } from '.'

export interface DriverResult extends ApiResult {
  driver: UserDetailDriver
}
