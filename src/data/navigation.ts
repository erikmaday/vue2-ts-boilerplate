import { NavigationLink } from '@/models/NavigationLink'

export const navigation: Array<NavigationLink> = [
  {
    label: 'Dashboard',
    link: 'dashboard',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Marketplace',
    link: 'marketplace',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'Bookings',
    link: 'bookings',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'My Company',
    link: 'company',
    location: 'top',
    params: {},
    permission: [],
  },
  {
    label: 'My Trips',
    link: 'trips',
    location: 'top',
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
