import { Link } from '@/models/Link'
import { Component } from 'vue'

export interface SidebarLink extends Link {
  icon?: string
  component: Component
  visible: boolean
}
