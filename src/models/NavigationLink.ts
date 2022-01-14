import { Link } from '@/models/Link'
export interface NavigationLink extends Link {
  action?(): void
  location: string
  params: Record<string, unknown>
  permission: string[]
  children?: NavigationLink[]
  icon?: string
  href?: string
}
