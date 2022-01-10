import { RawLocation } from 'vue-router'
export interface ActionColumn {
  displayText: string
  key: string
  icon: string
  color?: string
  textClasses?: string
  ariaLabel?: string
  confirmModal?: boolean
  confirmModalText?: string
  action?: any
  isDetail?: boolean
<<<<<<< HEAD
  detailRoute?: (row: any) => RawLocation
=======
  detailRoute?: (row: any) => Location
  hide?: boolean
>>>>>>> master
}
