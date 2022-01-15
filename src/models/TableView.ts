import { DataTableColumn } from './DataTableColumn'

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

export interface TableViewFilterChip {
  label: string
  count: number
  filters?: TableViewFilter[]
  active: boolean
  buildFilters?: any
}

export interface ChipFilterState {
  filters: any
  filterParentOr: any
}

export interface PredefinedFilter {
  id?: string
  _t_id: string
  text: string
  refreshOnSelect: boolean
  active: boolean
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
