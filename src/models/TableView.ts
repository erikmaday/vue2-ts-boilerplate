import { DataTableColumn } from './DataTableColumn'
import { TextValue } from './TextValue'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableViewParameters {
  sorts?: any
  filters?: any
  pageSize?: number
  page?: number
}

export interface TableViewResult<T> {
  count: number
  resultList: T[]
}

export interface TableViewFilter {
  column: DataTableColumn
  value: string | number
  hideOnFilterBar?: boolean
}

export interface TableViewTab extends TableViewFilter {
  default?: boolean
  isShowAll?: boolean
  isLocked?: boolean
}

export interface TableViewChip {
  _t_id: string
  text: string
  values: TableViewChipValue
}

export interface TableViewChipValue {
  text: string
  values: TableViewFilter[]
}

export interface TodayFilterChip {
  label: string
  count: number
  filters?: TableViewFilter[]
  active: boolean
  buildFilters?: any
}

export interface TodayChipFilterState {
  filters: any
  filterParentOr: any
}

export interface PredefinedFilter {
  id?: string
  _t_id: string
  active?: boolean
  text: string
  refreshOnSelect: boolean
  controls: PredefinedFilterControl[]
}

export interface PredefinedFilterControl {
  _t_id: string
  text: string
  filterType: string
  value: string
  displayValue?: string
  recalculate: string
}
