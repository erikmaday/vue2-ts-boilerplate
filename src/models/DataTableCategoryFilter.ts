import { TextValue } from './TextValue'

export interface DataTableCategoryFilter extends TextValue {
  _t_id: string
  type: string
  method: string
  values: TextValue[]
}
