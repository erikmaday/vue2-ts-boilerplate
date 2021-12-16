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
  column: {
    _t_id: string
    prop: string
    filterType: string
  }
  value: string | number
}

export interface TableViewFilterChip {
  label: string
  count: number
  filter: TableViewFilter[]
  active: boolean
}
