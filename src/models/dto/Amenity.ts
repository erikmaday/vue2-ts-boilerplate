import { Type } from '.'

export interface AmenityType extends Type {
  active: boolean
  companyId: number | null
  id: number
}
