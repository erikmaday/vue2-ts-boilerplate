import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  ReservationType,
  ReferralStatus,
  ReservationStatus,
} from '@/utils/enum'
import { TableViewFilter } from '@/models/dto'

const currentTimestamp = (): dayjs.Dayjs => {
  dayjs.extend(utc)
  return dayjs().utc()
}

const reservationFilters: { [key: string]: TableViewFilter } = {
  isReferral: {
    column: {
      _t_id: '5e1dfd51-9620-4cd5-9b3f-ca91ce6aadf9',
      prop: 'reservationType',
      filterType: 'eq',
    },
    value: ReservationType.Referral,
  },
  isInProgress: {
    column: {
      _t_id: '5b583f16-1d99-43c2-9e74-4f3df497c25f',
      prop: 'reservationStatus',
      filterType: 'eq',
    },
    value: ReservationStatus.Started,
  },
  isAccepted: {
    column: {
      _t_id: 'f9dd8140-d676-4485-9c8b-0cd2f226a2ad',
      prop: 'referralStatus',
      filterType: 'eq',
    },
    value: ReferralStatus.Accepted,
  },
  isNotAccepted: {
    column: {
      _t_id: 'f9dd8140-d676-4485-9c8b-0cd2f226a2ad',
      prop: 'referralStatus',
      filterType: 'eq',
    },
    value: ReferralStatus.Offered,
  },
  needsDriverAssignment: {
    column: {
      _t_id: '3716f4e0-ee25-4426-9493-9cce6547475d',
      prop: 'assignedDriverPercentage',
      filterType: 'lte',
    },
    value: 99.99,
  },
  needsVehicleAssignment: {
    column: {
      _t_id: '348a7adb-72ee-4da5-8134-753263c7663c',
      prop: 'assignedVehiclePercentage',
      filterType: 'lte',
    },
    value: 99.99,
  },
  isFinished: {
    column: {
      _t_id: 'f9668131-3d1a-45ff-bbef-33c9b7cf832a',
      prop: 'reservationStatus',
      filterType: 'eq',
    },
    value: ReservationStatus.Finished,
  },
  isUpcoming: {
    column: {
      _t_id: 'f9668131-3d1a-45ff-bbef-33c9b7cf832a',
      prop: 'reservationStatus',
      filterType: 'eq',
    },
    value: ReservationStatus.Upcoming,
  },
  isStartDateInFuture: {
    column: {
      _t_id: '533d2c12-0b01-4945-a375-cb7c2e2040ec',
      prop: 'startDate',
      filterType: 'gte',
    },
    value: currentTimestamp().format('YYYY-MM-DD'),
  },
  isStartDateLessThanADayAway: {
    column: {
      _t_id: '0b2c67aa-7350-4cc7-b6d0-e9cdb113ff15',
      prop: 'startDate',
      filterType: 'lte',
    },
    value: currentTimestamp().add(1, 'day').format('YYYY-MM-DD'),
  },
}

export default reservationFilters