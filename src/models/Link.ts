export interface Link {
  href?: string
  label: string
  name?: string
  params?: Record<string, unknown>
  permission?: Array<string>
}
