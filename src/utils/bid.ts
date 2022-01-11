import bid from '@/services/bid'
import auth from '@/store/modules/auth'
import { filter } from './filter'

export const getExistingBidsByTripId = (tripId: number): any => {
  const filterInstance = filter()
  const parentFilter = filterInstance.createParent('and')
  filterInstance.add(parentFilter, {
    column: {
      _t_id: '4481ca2b-b707-4b96-b720-712cd6efebf5',
      value: 'tripId',
      filterType: 'eq',
    },
    value: tripId,
  })
  filterInstance.add(parentFilter, {
    column: {
      _t_id: '28c88035-db00-4c10-a674-a37aaa4fff12',
      value: 'companyId',
      filterType: 'eq',
    },
    value: auth.user?.companyId,
  })
  const params = {
    page: 1,
    pageSize: -1,
    filters: filterInstance.asQueryParams(),
    sorts: undefined,
  }
  return bid.tableView(params)
}
