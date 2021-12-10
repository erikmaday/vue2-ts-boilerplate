/* eslint-disable @typescript-eslint/no-explicit-any */
export default function deepClone(object: any): any {
  return JSON.parse(JSON.stringify(object))
}
