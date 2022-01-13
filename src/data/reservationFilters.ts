import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  ReservationType,
  ReferralStatus,
  ReservationStatus,
} from '@/utils/enum'
import { TableViewFilter } from '@/models/TableView'

const currentTimestamp = (): dayjs.Dayjs => {
  dayjs.extend(utc)
  return dayjs().utc()
}

const reservationFilters: { [key: string]: TableViewFilter } = {
  isReferral: {
    column: {
      _t_id: '5e1dfd51-9620-4cd5-9b3f-ca91ce6aadf9',
      value: 'reservationType',
      filterType: 'eq',
      text: '',
      type: 'text',
    },
    value: ReservationType.Referral,
  },
  isInProgress: {
    column: {
      _t_id: '5b583f16-1d99-43c2-9e74-4f3df497c25f',
      value: 'parentReservation.reservationStatus',
      filterType: 'eq',
      text: '',
      type: 'text',
    },
    value: ReservationStatus.Started,
  },
  isAccepted: {
    column: {
      _t_id: 'f9dd8140-d676-4485-9c8b-0cd2f226a2ad',
      value: 'referralStatus',
      filterType: 'eq',
      text: '',
      type: 'text',
    },
    value: ReferralStatus.Accepted,
  },
  isOffered: {
    column: {
      _t_id: 'f9dd8140-d676-4485-9c8b-0cd2f226a2ad',
      value: 'referralStatus',
      filterType: 'eq',
      text: '',
      type: 'text',
    },
    value: ReferralStatus.Offered,
  },
  needsDriverAssignment: {
    column: {
      _t_id: '3716f4e0-ee25-4426-9493-9cce6547475d',
      value: 'assignedDriverPercentage',
      filterType: 'lte',
      text: '',
      type: 'number',
    },
    value: 99.99,
  },
  needsVehicleAssignment: {
    column: {
      _t_id: '348a7adb-72ee-4da5-8134-753263c7663c',
      value: 'assignedVehiclePercentage',
      filterType: 'lte',
      text: '',
      type: 'number',
    },
    value: 99.99,
  },
  isFinished: {
    column: {
      _t_id: 'f9668131-3d1a-45ff-bbef-33c9b7cf832a',
      value: 'parentReservation.reservationStatus',
      filterType: 'eq',
      text: '',
      type: 'text',
    },
    value: ReservationStatus.Finished,
  },
  isUpcoming: {
    column: {
      _t_id: 'f9668131-3d1a-45ff-bbef-33c9b7cf832a',
      value: 'parentReservation.reservationStatus',
      filterType: 'eq',
      text: '',
      type: 'text',
    },
    value: ReservationStatus.Upcoming,
  },
  isStartDateInFuture: {
    column: {
      _t_id: '533d2c12-0b01-4945-a375-cb7c2e2040ec',
      value: 'startDate',
      filterType: 'gte',
      text: '',
      type: 'date',
    },
    value: currentTimestamp().local().format('YYYY-MM-DD'),
  },
  isStartDateLessThanADayAway: {
    column: {
      _t_id: '0b2c67aa-7350-4cc7-b6d0-e9cdb113ff15',
      value: 'startDate',
      filterType: 'lte',
      text: '',
      type: 'date',
    },
    value: currentTimestamp().add(1, 'day').local().format('YYYY-MM-DD'),
  },
  isStartDateLessThanAWeekAway: {
    column: {
      _t_id: 'c3af75ac-3287-4279-be11-5a13ee4977f6',
      value: 'startDate',
      filterType: 'lte',
      text: '',
      type: 'date',
    },
    value: currentTimestamp().add(7, 'day').local().format('YYYY-MM-DD'),
  },
  isStartDateLessThanAThreeDaysAgo: {
    column: {
      _t_id: '085117cd-a45d-483b-a447-6f6c981a49de',
      value: 'startDate',
      filterType: 'gte',
      text: '',
      type: 'date',
    },
    value: currentTimestamp().subtract(3, 'day').local().format('YYYY-MM-DD'),
  },
  wasOfferedInLastDay: {
    column: {
      _t_id: '2e3c0fa4-a8f6-43a3-94e7-903dc0cc41f9',
      value: 'sentDate',
      filterType: 'gte',
      text: '',
      type: 'date',
    },
    value: currentTimestamp().subtract(1, 'day').local().format('YYYY-MM-DD'),
  },
}

export default reservationFilters
