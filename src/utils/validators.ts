export const isNotEmpty = (val: any): boolean => {
  return !!val
}

export const isNotEmptyInput = (val: any): boolean => {
  return !(val === '' || val == null)
}

export const isNotEmptyArray = (val: any): boolean => {
  if (!val) {
    return false
  }
  if (!val?.length) {
    return false
  }
  return true
}

export const isNotNegative = (val: any): boolean => {
  if (isNaN(Number(val))) {
    return true
  }
  return Number(val) >= 0
}
