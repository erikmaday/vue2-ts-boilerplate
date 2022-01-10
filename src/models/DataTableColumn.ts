import { TextValue } from './TextValue'
import { Component } from 'vue'

export interface DataTableColumn extends TextValue {
  _t_id: string
  computedText?: (row: any) => string
  type?: string
  component?: Component
  filterable?: boolean
  filterProp?: string | string[]
  filterType?: string
  method?: string
  sortable?: boolean
  sortProp?: string
  hidden?: boolean
  defaultSort?: boolean
}
