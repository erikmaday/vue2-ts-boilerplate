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
  filter: TableViewFilter[]
  active: boolean
}
