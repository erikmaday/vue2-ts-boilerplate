import { TextValue } from './TextValue'
import { Component } from 'vue'
import { Rule } from '@/models/Rule'

export interface DataTableColumn extends TextValue {
  _t_id: string
  computedText?: (row: any) => string
  type?: string
  component?: Component
  classes?: string
  editableRules?: Rule[]
}
