import { NavigationLink } from '@/models/NavigationLink'

export const navigation: Array<NavigationLink> = [
  {
    label: 'Dashboard',
    href: 'dashboard',
    name: 'dashboard',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Marketplace',
    href: 'marketplace',
    name: 'marketplace',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Bookings',
    href: 'bookings',
    name: 'bookings',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'My Company',
    href: 'company',
    name: 'company',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'My Trips',
    href: 'trips',
    name: 'trips',
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
