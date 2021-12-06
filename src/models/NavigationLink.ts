export interface NavigationLink {
  label: string
  link?: string
  action?(): void
  location: string
  params: Record<string, unknown>
  permission: string[]
}
