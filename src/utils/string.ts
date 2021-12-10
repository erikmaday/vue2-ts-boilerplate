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


export function phoneFormatFilter(input: string): string {
  const inp = input.replace(/[^0-9]/gi, '')

  if (input[0] === '1') {
    return `(${inp.substring(1, 4)}) ${inp.substring(4, 7)}-${inp.substring(7)}`
  }

  return `(${inp.substring(0, 3)}) ${inp.substring(3, 6)}-${inp.substring(6)}`
}
