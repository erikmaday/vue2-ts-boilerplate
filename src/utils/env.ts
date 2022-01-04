import axios from 'axios'

const hostPrefix = (prefix: string | null) => (prefix ? `${prefix}.` : '')

export const apiBaseUrl = (prefix = 'api'): string => {
  let host
  if (process.env.VUE_APP_BASE_URL_OVERRIDE) {
    host = process.env.VUE_APP_BASE_URL_OVERRIDE
  } else {
    const hostSubdomain = window.location.host.split(':')[0].split('.')[0]
    if (hostSubdomain === 'localhost') {
      host = 'dev.coachrail.com'
    } else {
      host = hostSubdomain + '.coachrail.com'
    }
  }
  axios.defaults.baseURL = `https://${hostPrefix(prefix)}${host}`
  return `${hostPrefix(prefix)}${host}`
}
