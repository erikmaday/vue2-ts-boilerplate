import { TextValue } from './TextValue'
import { Component } from 'vue'

export interface DataTableColumn extends TextValue {
  computedText?: (row: any) => string
  type?: string
  component?: Component
}
