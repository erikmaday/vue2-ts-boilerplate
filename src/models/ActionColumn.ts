export interface ActionColumn {
  displayText: string
  key: string
  icon: string
  color?: string
  ariaLabel?: string
  confirmModal?: boolean
  confirmModalText?: string
  action?: any
  isDetail?: boolean
  detailName?: string
  hide?: boolean
}
