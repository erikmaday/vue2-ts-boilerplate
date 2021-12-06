import { NavigationLink } from '@/models/NavigationLink'
import modules from '@/store/modules'

export const navigation: NavigationLink[] = [
  {
    label: 'Today',
    link: 'today',
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
