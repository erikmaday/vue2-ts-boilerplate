import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { ReservationDetailStop, Stop } from '@/models/dto'

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
