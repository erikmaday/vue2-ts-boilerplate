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

export const numberWithCommas = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
