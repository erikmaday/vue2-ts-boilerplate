import { TableViewResult } from '../TableView'

export interface SystemParameter {
  systemParameterId: number
  active: boolean
  dataType: number
  description: string | null
  name: string
  value: string
}

export type SystemParameterTableViewResult = TableViewResult<SystemParameter>
