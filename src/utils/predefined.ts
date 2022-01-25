import { PredefinedFilter } from '@/models/TableView'
import { v4 as uuidv4 } from 'uuid'
import deepClone from '@/utils/deepClone'

export function processPredefined(set: PredefinedFilter[]): PredefinedFilter[] {
  const processedPredefined = deepClone(set)
  for (const predefined of processedPredefined) {
    for (const control of predefined.controls) {
      control._t_id = uuidv4()
    }
    predefined._t_id = uuidv4()
  }
  return processedPredefined
}
