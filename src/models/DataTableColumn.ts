import { TextValue } from './TextValue'

export interface DataTableColumn extends TextValue {
  computedText?: (row: any) => string
}
