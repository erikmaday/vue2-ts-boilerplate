import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { Reservation, ReservationDetailStop, Stop } from '@/models/dto'
import { anyNumberPattern, stateAbbreviationPattern } from './regex'
import { Markup, MarkupDetail } from '@/models/dto/Markup'

dayjs.extend(utc)
dayjs.extend(timezone)

export const toKebab = (string: string): string => {
  return string
    .split('')
    .map((letter) => {
      if (/[A-Z]/.test(letter)) {
        return ` ${letter.toLowerCase()}`
      }
      return letter
    })
    .join('')
    .trim()
    .replace(/[_\s]+/g, '-')
}

export const toCamel = (string: string): string => {
  return toKebab(string)
    .split('-')
    .map((word, index) => {
      if (index === 0) return word
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

export const toPascal = (string: string): string => {
  const interim = toCamel(string)
  return interim.slice(0, 1).toUpperCase() + interim.slice(1)
}

export const toTitle = (string: string): string => {
  return toKebab(string)
    .split('-')
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const toSentence = (string: string): string => {
  const interim = toKebab(string).replace(/-/g, ' ')
  return interim.slice(0, 1).toUpperCase() + interim.slice(1)
}

export const toSnake = (string: string): string => {
  return toKebab(string).replace('-', '_')
}

export const pluralize = (
  count: number,
  noun: string,
  suffix = 's'
): string => {
  if (noun.endsWith('s')) {
    suffix = 'es'
    return `${noun}${count !== 1 ? suffix : ''}`
  }

  return `${noun}${count !== 1 ? suffix : ''}`
}

export const currencyFilter = (input: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  })
  return `${formatter.format(input)}`
}

export const roundedCurrencyFilter = (input: number): string => {
  return `${currencyFilter(Math.round(input)).split('.')[0]}`
}

export const phoneFormatFilter = (input: string): string => {
  const inp = input.replace(/[^0-9]/gi, '')

  if (input[0] === '1') {
    return `(${inp.substring(1, 4)}) ${inp.substring(4, 7)}-${inp.substring(7)}`
  }

  return `(${inp.substring(0, 3)}) ${inp.substring(3, 6)}-${inp.substring(6)}`
}

export const truncate = (
  string: string,
  numCharacters: number,
  endOnFullWord: boolean
): string => {
  if (string.length <= numCharacters) {
    return string
  }
  const subString = string.substr(0, numCharacters - 1)
  return (
    (endOnFullWord
      ? subString.substr(0, subString.lastIndexOf(' '))
      : subString) + '...'
  )
}

export const formatStopAddress = (stop: ReservationDetailStop): string => {
  const address = stop.address
  const street1IsPresent = address.street1 && address.street1 !== ' '
  const street2IsPresent = address.street2 && address.street2 !== ' '

  let addressString = ''
  if (
    !street1IsPresent &&
    !street2IsPresent &&
    address.title &&
    address.title !== address.city
  ) {
    addressString = `${address.title}`
  } else {
    if (street1IsPresent) {
      addressString = `${address.street1}`
    }
    if (street2IsPresent) {
      addressString = `${addressString} ${address.street2}`
    }
  }
  if (address.city) {
    if (addressString.length) {
      addressString = `${addressString},`
    }
    addressString = `${addressString} ${address.city}`
  }
  if (address.state) {
    addressString = `${addressString}, ${address.state}`
  }
  return addressString
}

export const formatStopTime = (time: string, timezone: string): string => {
  const datetime = dayjs(time).tz(timezone)
  return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
}

export const formatDropoffTime = (stop: Stop): string => {
  return formatStopTime(stop.dropoffDatetime, stop.address.timeZone)
}

export const formatPickupTime = (stop: Stop): string => {
  return formatStopTime(stop.pickupDatetime, stop.address.timeZone)
}

export const cityFromAddressName = (addressName: string): string | null => {
  if (!addressName) {
    return null
  }
  const addressNameSplit = addressName.replace(anyNumberPattern, '').split(',')
  const stateIndex = addressNameSplit.findIndex((string) =>
    stateAbbreviationPattern.test(string)
  )
  return addressNameSplit[stateIndex - 1]
}

export const getReservationPickupDestinationCities = (
  reservation: Reservation
): { pickup: string; dropoff: string } => {
  const pickup = reservation.pickupLocation
    ? reservation.pickupLocation.split(',')[0]
    : cityFromAddressName(reservation.firstPickupAddressName)

  let dropoff
  if (reservation.firstDropoffAddressName) {
    dropoff = cityFromAddressName(reservation.firstDropoffAddressName)
  }
  if (!dropoff) {
    dropoff = pickup
  }

  return { pickup, dropoff }
}

export const formatReservationPickupDestinationText = (
  reservation: Reservation
): string => {
  const cities = getReservationPickupDestinationCities(reservation)
  return `${cities.pickup} > ${cities.dropoff}`
}
export const formatMarkupStartDateTime = (
  row: Markup | MarkupDetail
): string => {
  if (!row.startDate) return null
  const datetime = dayjs(row.startDate.split('T')[0])
  return `${datetime.format('MM/DD/YYYY')}`
}

export const formatMarkupEndDateTime = (row: Markup | MarkupDetail): string => {
  if (!row.endDate) return null
  const datetime = dayjs(row.endDate.split('T')[0])
  return `${datetime.format('MM/DD/YYYY')}`
}

const th_val = ['', 'thousand', 'million', 'billion', 'trillion']
const dg_val = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]
const tn_val = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const tw_val = [
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
]

export const numberToString = (number: any) => {
  number = number.toString()
  number = number.replace(/[, ]/g, '')
  if (number != parseFloat(number)) return 'not a number '
  let x_val = number.indexOf('.')
  if (x_val == -1) x_val = number.length
  if (x_val > 15) return 'too big'
  const n_val = number.split('')
  let str_val = ''
  let sk_val = 0
  for (let i = 0; i < x_val; i++) {
    if ((x_val - i) % 3 == 2) {
      if (n_val[i] == '1') {
        str_val += tn_val[Number(n_val[i + 1])] + ' '
        i++
        sk_val = 1
      } else if (n_val[i] != 0) {
        str_val += tw_val[n_val[i] - 2] + ' '
        sk_val = 1
      }
    } else if (n_val[i] != 0) {
      str_val += dg_val[n_val[i]] + ' '
      if ((x_val - i) % 3 == 0) str_val += 'hundred '
      sk_val = 1
    }
    if ((x_val - i) % 3 == 1) {
      if (sk_val) str_val += th_val[(x_val - i - 1) / 3] + ' '
      sk_val = 0
    }
  }
  if (x_val != number.length) {
    const y_val = number.length
    str_val += 'point '
    for (let i = x_val + 1; i < y_val; i++) str_val += dg_val[n_val[i]] + ' '
  }
  return str_val.replace(/\s+/g, ' ')
}
