import { NavigationLink } from '@/models/NavigationLink'

export const navigation: Array<NavigationLink> = [
  {
    label: 'Dashboard',
    href: 'dashboard',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Marketplace',
    href: 'marketplace',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Bookings',
    href: 'bookings',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'My Company',
    href: 'company',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'My Trips',
    href: 'trips',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Support',
    location: 'mobile',
    params: {},
    permission: [],
  },
  {
    label: 'Logout',
    location: 'dropdown',
    action: () => console.log('test'),
    params: {},
    permission: [],
  },
]
