/* eslint-disable @typescript-eslint/no-explicit-any */

export const save = (key: string, value: any): void => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const load = (key: string): any => {
  const data = window.localStorage.getItem(key)
  return data ? JSON.parse(data) : data
}
