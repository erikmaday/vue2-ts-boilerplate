import { PredefinedFilter } from '@/models/TableView'
import dayjs from 'dayjs'

function promisify(syncFunction): Promise<string> {
  return new Promise((resolve) => resolve(syncFunction()))
}

export const calculatedValues = {
  'Range Start': (): Promise<string> =>
    promisify(() => dayjs().local().format('YYYY-MM-DD')),
  'Range End': (): Promise<string> =>
    promisify(() => dayjs().local().format('YYYY-MM-DD')),
  'Last 7 Days Start': (): Promise<string> =>
    promisify(() => dayjs().subtract(7, 'days').local().format('YYYY-MM-DD')),
  'Last 7 Days End': (): Promise<string> =>
    promisify(() => dayjs().local().format('YYYY-MM-DD')),
  'Next 7 Days Start': (): Promise<string> =>
    promisify(() => dayjs().local().format('YYYY-MM-DD')),
  'Next 7 Days End': (): Promise<string> =>
    promisify(() => dayjs().add(7, 'days').local().format('YYYY-MM-DD')),
  'This Month Start': (): Promise<string> =>
    promisify(() => dayjs().local().startOf('month').format('YYYY-MM-DD')),
  'This Month End': (): Promise<string> =>
    promisify(() => dayjs().local().endOf('month').format('YYYY-MM-DD')),
  'Last Month Start': (): Promise<string> =>
    promisify(() =>
      dayjs()
        .local()
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM-DD')
    ),
  'Last Month End': (): Promise<string> =>
    promisify(() =>
      dayjs().local().subtract(1, 'months').endOf('month').format('YYYY-MM-DD')
    ),
  'Next Month Start': (): Promise<string> =>
    promisify(() =>
      dayjs().local().add(1, 'months').startOf('month').format('YYYY-MM-DD')
    ),
  'Next Month End': (): Promise<string> =>
    promisify(() =>
      dayjs().local().add(1, 'months').endOf('month').format('YYYY-MM-DD')
    ),
  'In The Future': (): Promise<string> =>
    promisify(() => dayjs().local().format('YYYY-MM-DD')),
  'In The Past': (): Promise<string> =>
    promisify(() => dayjs().local().format('YYYY-MM-DD')),
  'Today Start': (): Promise<string> =>
    promisify(() => dayjs().local().startOf('day').format('YYYY-MM-DD')),
  'Today End': (): Promise<string> =>
    promisify(() => dayjs().local().endOf('day').format('YYYY-MM-DD')),
  'Tomorrow Start': (): Promise<string> =>
    promisify(() =>
      dayjs().local().add(1, 'days').startOf('day').format('YYYY-MM-DD')
    ),
  'Tomorrow End': (): Promise<string> =>
    promisify(() =>
      dayjs().local().add(1, 'days').endOf('day').format('YYYY-MM-DD')
    ),
}

export const datePredefined: PredefinedFilter[] = [
  {
    _t_id: 'b0ee285c-36c0-4b67-852f-4d4061c71632',
    text: 'Range',
    refreshOnSelect: false,
    controls: [
      {
        _t_id: '33d667e1-7680-4121-87ae-adc33d9639ec',
        text: 'Start',
        filterType: 'gte',
        value: 'Range Start',
        displayValue: '',
        recalculate: 'Range Start',
      },
      {
        _t_id: 'f90720ee-688d-4a31-a7ae-cb28419fa7e7',
        text: 'End',
        filterType: 'lte',
        value: 'Range End',
        displayValue: '',
        recalculate: 'Range End',
      },
    ],
  },
  {
    _t_id: '5e7022f5-7d5b-4863-9f77-bf6247b98131',
    text: 'Today',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '2b4e7209-743a-4162-800c-56544247deb8',
        text: 'Start',
        filterType: 'gte',
        value: 'Today Start',
        displayValue: '',
        recalculate: 'Today Start',
      },
      {
        _t_id: 'c4b47a97-d9ba-4c6f-8ce0-2e73f942f2e1',
        text: 'End',
        filterType: 'lte',
        // hide: true,
        value: 'Today End',
        displayValue: '',
        recalculate: 'Today End',
      },
    ],
  },
  {
    _t_id: '6239fa82-b2cb-47ac-821d-52afc3e072b6',
    text: 'Tomorrow',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: 'd14f6d56-15e6-463e-bc70-a4de773733a5',
        text: 'Start',
        filterType: 'gte',
        value: 'Tomorrow Start',
        displayValue: '',
        recalculate: 'Tomorrow Start',
      },
      {
        _t_id: '154eba01-3ef8-4327-99b9-f756a384b9f4',
        text: 'End',
        filterType: 'lte',
        value: 'Tomorrow End',
        displayValue: '',
        recalculate: 'Tomorrow End',
      },
    ],
  },
  {
    _t_id: '4142b5dc-37fb-433a-a363-5ae6a3ef5967',
    text: 'Last 7 days',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: 'a8fdfff9-4e7d-42d9-b43a-05de2e7c72e9',
        text: 'Start',
        filterType: 'gte',
        value: 'Last 7 Days Start',
        displayValue: '',
        recalculate: 'Last 7 Days Start',
      },
      {
        _t_id: 'ca900e56-25b0-42bc-b97f-046a8b81d856',
        text: 'End',
        filterType: 'lte',
        value: 'Last 7 Days End',
        displayValue: '',
        recalculate: 'Last 7 Days End',
      },
    ],
  },
  {
    _t_id: 'efc3b6cb-2be1-4809-9a75-8bd1cbd227d4',
    text: 'Next 7 days',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: 'e4a8b446-a3de-4883-bc04-a4064f7a1b97',
        text: 'Start',
        filterType: 'gte',
        value: 'Next 7 Days Start',
        displayValue: '',
        recalculate: 'Next 7 Days Start',
      },
      {
        _t_id: 'd4711a35-e36c-4190-b3e0-ae8b62447d0c',
        text: 'End',
        filterType: 'lte',
        value: 'Next 7 Days End',
        displayValue: '',
        recalculate: 'Next 7 Days End',
      },
    ],
  },
  {
    _t_id: '452f8663-083a-47d0-9578-e692a0ec3ce1',
    text: 'This month',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: 'c4a09705-2f69-4005-9aac-81eea3e2005d',
        text: 'Start',
        filterType: 'gte',
        value: 'This Month Start',
        displayValue: '',
        recalculate: 'This Month Start',
      },
      {
        _t_id: '2e548210-c9e3-4455-86f2-f2d6a6d42a4c',
        text: 'End',
        filterType: 'lte',
        value: 'This Month End',
        displayValue: '',
        recalculate: 'This Month End',
      },
    ],
  },
  {
    _t_id: 'fcb06d5a-a8db-425d-92fb-c54b543d3ff6',
    text: 'Last month',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '7db5fb5b-70e6-447d-8879-fc35199363bc',
        text: 'Start',
        filterType: 'gte',
        value: 'Last Month Start',
        displayValue: '',
        recalculate: 'Last Month Start',
      },
      {
        _t_id: 'c4ec5fed-74ee-4ffd-903e-0782053a480c',
        text: 'End',
        filterType: 'lte',
        value: 'Last Month End',
        displayValue: '',
        recalculate: 'Last Month End',
      },
    ],
  },
  {
    _t_id: '62318011-96ca-4386-9206-c741e39f314c',
    text: 'Next month',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '68b79294-bd1e-410b-80f9-623de4894c49',
        text: 'Start',
        filterType: 'gte',
        value: 'Next Month Start',
        displayValue: '',
        recalculate: 'Next Month Start',
      },
      {
        _t_id: '2b05a49d-a85c-4f92-9c5c-7f5b05d30b3b',
        text: 'End',
        filterType: 'lte',
        value: 'Next Month End',
        displayValue: '',
        recalculate: 'Next Month End',
      },
    ],
  },
  {
    _t_id: 'f1598e76-34ee-4cd2-964b-2c6b0eb018dd',
    text: 'In the past',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '44c9f676-06c5-446f-9485-9713dcfcbec5',
        text: 'Start',
        filterType: 'lte',
        value: 'In The Past',
        displayValue: '',
        recalculate: 'In The Past',
      },
    ],
  },
  {
    _t_id: '3f071975-fcf7-454d-9133-efcb25f1eda7',
    text: 'In the future',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '2bad0a10-4efb-4e2e-964b-816a65b95636',
        text: 'Start',
        filterType: 'gte',
        value: 'In The Future',
        displayValue: '',
        recalculate: 'In The Future',
      },
    ],
  },
]

export const noFutureDatesPredefined: PredefinedFilter[] = [
  {
    _t_id: 'b0ee285c-36c0-4b67-852f-4d4061c71632',
    text: 'Range',
    refreshOnSelect: false,
    controls: [
      {
        _t_id: '33d667e1-7680-4121-87ae-adc33d9639ec',
        text: 'Start',
        filterType: 'gte',
        value: 'Range Start',
        displayValue: '',
        recalculate: 'Range Start',
      },
      {
        _t_id: 'f90720ee-688d-4a31-a7ae-cb28419fa7e7',
        text: 'End',
        filterType: 'lte',
        value: 'Range End',
        displayValue: '',
        recalculate: 'Range End',
      },
    ],
  },
  {
    _t_id: '5e7022f5-7d5b-4863-9f77-bf6247b98131',
    text: 'Today',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '2b4e7209-743a-4162-800c-56544247deb8',
        text: 'Start',
        filterType: 'gte',
        value: 'Today Start',
        displayValue: '',
        recalculate: 'Today Start',
      },
      {
        _t_id: 'c4b47a97-d9ba-4c6f-8ce0-2e73f942f2e1',
        text: 'End',
        filterType: 'lte',
        // hide: true,
        value: 'Today End',
        displayValue: '',
        recalculate: 'Today End',
      },
    ],
  },
  {
    _t_id: '4142b5dc-37fb-433a-a363-5ae6a3ef5967',
    text: 'Last 7 days',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: 'a8fdfff9-4e7d-42d9-b43a-05de2e7c72e9',
        text: 'Start',
        filterType: 'gte',
        value: 'Last 7 Days Start',
        displayValue: '',
        recalculate: 'Last 7 Days Start',
      },
      {
        _t_id: 'ca900e56-25b0-42bc-b97f-046a8b81d856',
        text: 'End',
        filterType: 'lte',
        value: 'Last 7 Days End',
        displayValue: '',
        recalculate: 'Last 7 Days End',
      },
    ],
  },
  {
    _t_id: '452f8663-083a-47d0-9578-e692a0ec3ce1',
    text: 'This month',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: 'c4a09705-2f69-4005-9aac-81eea3e2005d',
        text: 'Start',
        filterType: 'gte',
        value: 'This Month Start',
        displayValue: '',
        recalculate: 'This Month Start',
      },
      {
        _t_id: '2e548210-c9e3-4455-86f2-f2d6a6d42a4c',
        text: 'End',
        filterType: 'lte',
        value: 'This Month End',
        displayValue: '',
        recalculate: 'This Month End',
      },
    ],
  },
  {
    _t_id: 'fcb06d5a-a8db-425d-92fb-c54b543d3ff6',
    text: 'Last month',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '7db5fb5b-70e6-447d-8879-fc35199363bc',
        text: 'Start',
        filterType: 'gte',
        value: 'Last Month Start',
        displayValue: '',
        recalculate: 'Last Month Start',
      },
      {
        _t_id: 'c4ec5fed-74ee-4ffd-903e-0782053a480c',
        text: 'End',
        filterType: 'lte',
        value: 'Last Month End',
        displayValue: '',
        recalculate: 'Last Month End',
      },
    ],
  },
  {
    _t_id: 'f1598e76-34ee-4cd2-964b-2c6b0eb018dd',
    text: 'In the past',
    refreshOnSelect: true,
    controls: [
      {
        _t_id: '44c9f676-06c5-446f-9485-9713dcfcbec5',
        text: 'Start',
        filterType: 'lte',
        value: 'In The Past',
        displayValue: '',
        recalculate: 'In The Past',
      },
    ],
  },
]
