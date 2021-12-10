export interface PaginationParams {
  pageSize: number
  currentPage: number
  breakpointSizes: PaginationBreakpoints
}

export interface PaginationBreakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}
