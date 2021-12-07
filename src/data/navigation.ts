import { NavigationLink } from '@/models/NavigationLink'
import modules from '@/store/modules'

export const navigation: NavigationLink[] = [
  {
    label: 'Today',
    href: 'today',
    name: 'today',
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
    label: 'Search',
    location: 'mobile',
    params: {},
    permission: [],
  },
  {
    label: 'Notifications',
    location: 'mobile',
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
    action: () => modules.auth.logout(),
    params: {},
    permission: [],
  },
]
