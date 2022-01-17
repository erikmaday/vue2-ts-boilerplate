import Router from '@/router'
import { Location, RawLocation } from 'vue-router'

export const openInNewTab = (location: Location | RawLocation): void => {
  const routeData = Router.resolve(location)
  if (routeData) {
    window.open(routeData.href, '_blank')
  }
}
