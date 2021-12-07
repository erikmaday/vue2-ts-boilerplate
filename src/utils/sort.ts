/* eslint-disable @typescript-eslint/no-explicit-any */
export const sort = function (): any {
  let arrayOfSort: Array<Array<string>> = []
  const get = function () {
    return arrayOfSort
  }

  const formatProp = function (p = '') {
    return p.replace(/\//g, '.')
  }

  const add = function (sortItem: { prop: string; direction: string }) {
    arrayOfSort = []
    arrayOfSort.push(['sort[0][field]', formatProp(sortItem.prop)])
    arrayOfSort.push(['sort[0][dir]', sortItem.direction])
  }

  const asQueryParams = function () {
    return arrayOfSort
      .filter((f) => f[0] !== null)
      .map((f) => `${f[0]}=${f[1]}`)
      .join('&')
  }

  return {
    get,
    add,
    asQueryParams,
  }
}
