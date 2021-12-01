export function phoneFormatFilter(input: string): string {
  const inp = input.replace(/[^0-9]/gi, '')

  if (input[0] === '1') {
    return `(${inp.substring(1, 4)}) ${inp.substring(4, 7)}-${inp.substring(7)}`
  }

  return `(${inp.substring(0, 3)}) ${inp.substring(3, 6)}-${inp.substring(6)}`
}
