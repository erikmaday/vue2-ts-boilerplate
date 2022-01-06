<template>
  <div class="position-relative w-full h-full">
    <span
      class="
        position-absolute
        top-12
        left-12
        z-5
        font-12 font-medium
        text-white
        padding-y-3 padding-l-3 padding-r-4
        background-error
        d-flex
        align-center
      "
    >
      <CUIcon color="white" class="margin-r-2">timer</CUIcon>
      Expires in {{ formattedExpiration }}
    </span>
    <GmapMap
      ref="map"
      :center="center"
      :zoom="10"
      :options="options"
      class="w-full h-full position-absolute top-0 left-0"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mapStyles } from '@/data/mapStyles'
import { gmapApi } from 'vue2-google-maps'
import { Trip } from '@/models/dto'
import upcoming from '@/assets/images/stopIcons/upcoming.png'
import inprogress from '@/assets/images/stopIcons/inprogress.png'
import completed from '@/assets/images/stopIcons/completed.png'
import last from '@/assets/images/stopIcons/last.png'
import { timeDifferenceAsObject, timeObjectToString } from '@/utils/time'
import { DirectionsResult, LatLngLiteral, Marker } from '@types/googlemaps'

@Component
export default class BidDetailMap extends Vue {
  @Prop({ required: false }) readonly trips!: Trip[]

  map = null
  center = { lat: 33.7842735, lng: -84.3793076 }
  bounds = null
  options = {
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    disableDefaultUi: true,
    styles: mapStyles,
  }
  markerOptions = {
    visible: false,
  }
  tripDirections: { [tripId: number]: DirectionsResult } = {}
  directionsRenderer = null
  markers: Marker[] = []
  directionDisplays = []

  @Watch('trips', { deep: true })
  tripsChanged(): void {
    this.clear()
    this.draw()
  }

  get google(): any {
    return gmapApi()
  }

  get formattedExpiration(): string {
    if (!this.trips.length) {
      return ''
    }
    const now = this.$dayjs.utc()
    const expiration = this.$dayjs(this.trips[0].biddingEndDate)
    return timeObjectToString(timeDifferenceAsObject(now, expiration))
  }

  async mounted(): Promise<void> {
    await this.establishMap()
    this.draw(true)
  }

  async establishMap(): Promise<void> {
    const map = await this.$refs.map.$mapPromise.then((map) => map)
    this.map = map
  }

  async draw(firstLoad = false): void {
    this.fitBounds()
    for (const trip of this.trips) {
      if (firstLoad) {
        const directions = await this.getDirections(trip)
        this.tripDirections[trip.tripId] = directions
      }
      this.drawRoute(this.tripDirections[trip.tripId], trip.tripId)
      this.drawMarkers(trip)
    }
  }

  clear(): void {
    this.clearMarkers()
    this.clearRoutes()
  }

  createDirectionsRenderer(): void {
    const routeLineOptions = {
      strokeColor: this.$vuetify.theme.themes.light.primary,
      strokeOpacity: 1.0,
      strokeWeight: 5,
    }
    const directionsRenderer = new this.google.maps.DirectionsRenderer({
      polylineOptions: routeLineOptions,
    })
    directionsRenderer.setOptions({
      map: this.map,
      markerOptions: this.markerOptions,
      preserveViewport: true,
    })
    return directionsRenderer
  }

  fitBounds(): Promise<void> {
    const bounds = new this.google.maps.LatLngBounds()
    for (const trip of this.trips) {
      for (const stop of trip.stops) {
        bounds.extend({ lat: stop.address.lat, lng: stop.address.lng })
      }
      this.map.fitBounds(bounds)
    }
  }

  getDirections(trip: Trip): Promise<void> {
    const directionsService = new this.google.maps.DirectionsService()

    const waypoints = this.getWaypoints(trip)
    const origin = waypoints[0].location
    let destination = waypoints[0].location

    if (origin.equals(destination)) {
      destination = waypoints.pop().location
    }

    return new Promise((resolve, reject) => {
      const request = {
        origin,
        destination,
        waypoints,
        travelMode: 'DRIVING',
      }

      directionsService.route(request, (response, status) => {
        if (status === 'OK') {
          resolve(response)
        } else {
          reject('Directions request failed due to ' + status)
        }
      })
    })
  }

  drawMarkers(trip: Trip): void {
    const waypoints = this.getWaypoints(trip)
    for (const [waypointIndex, waypoint] of waypoints.entries()) {
      const iconImage = this.getIconImage(waypoints, waypointIndex)
      this.markers.push(
        new this.google.maps.Marker({
          position: waypoint.location,
          icon: {
            url: iconImage,
            scaledSize: new this.google.maps.Size(20, 20),
          },
          map: this.map,
        })
      )
    }
  }

  clearMarkers(): void {
    for (const marker of this.markers) {
      marker.setMap(null)
    }
    this.markers = []
  }

  drawRoute(directions: DirectionsResult): Promise<void> {
    let directionsRenderer = this.createDirectionsRenderer()
    directionsRenderer.setDirections(directions)
    this.directionDisplays.push(directionsRenderer)
  }

  clearRoutes() {
    for (const directionDisplay of this.directionDisplays) {
      directionDisplay.setMap(null)
    }
    this.directionDisplays = []
  }

  getWaypoints(trip: Trip): { location: LatLngLiteral; stopover: boolean }[] {
    return trip.stops.map((stop) => {
      return {
        location: new this.google.maps.LatLng(
          stop.address.lat,
          stop.address.lng
        ),
        stopover: true,
      }
    })
  }

  getIconImage(waypoints: [], waypointIndex: number): any {
    if (waypointIndex === waypoints.length - 1) {
      return last
    }
    if (waypointIndex === 0) {
      return inprogress
    }
    return upcoming
  }
}
</script>
