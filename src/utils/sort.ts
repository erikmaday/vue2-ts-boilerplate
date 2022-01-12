/* eslint-disable @typescript-eslint/no-explicit-any */
export const sort = (): any => {
  let arrayOfSort: Array<Array<string>> = []
  const get = function () {
    return arrayOfSort
  }

  const formatProp = (p = ''): string => {
    return p.replace(/\//g, '.')
  }

  const add = (sortItem: { prop: string; direction: string }): void => {
    arrayOfSort = []
    arrayOfSort.push(['sort[0][field]', formatProp(sortItem.prop)])
    arrayOfSort.push(['sort[0][dir]', sortItem.direction])
  }

  const remove = (): void => {
    arrayOfSort = []
  }

  const asQueryParams = (): string => {
    return arrayOfSort
      .filter((f) => f[0] !== null)
      .map((f) => `${f[0]}=${f[1]}`)
      .join('&')
  }

  return {
    get,
    add,
    remove,
    asQueryParams,
  }
}
