<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="10"
    :options="options"
    class="w-full h-240"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapStyles } from '@/data/mapStyles'
import { gmapApi } from 'vue2-google-maps'
import { ReservationDetail } from '@/models/dto'
import upcoming from '@/assets/images/stopIcons/upcoming.png'
import inprogress from '@/assets/images/stopIcons/inprogress.png'
import completed from '@/assets/images/stopIcons/completed.png'
import last from '@/assets/images/stopIcons/last.png'

@Component
export default class BookingDetailMap extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

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

  get google(): any {
    return gmapApi()
  }

  async mounted(): Promise<void> {
    await this.loadData()
    await this.plotRoute()
  }

  async loadData(): Promise<void> {
    const map = await this.$refs.map.$mapPromise.then((map) => map)
    this.map = map
    const bounds = new this.google.maps.LatLngBounds()

    for (const stop of this.reservation.stops) {
      bounds.extend({ lat: stop.address.lat, lng: stop.address.lng })
    }
    this.map.fitBounds(bounds)
  }

  async plotRoute(): Promise<void> {
    const routeLineOptions = {
      strokeColor: this.$vuetify.theme.themes.light.primary,
      strokeOpacity: 1.0,
      strokeWeight: 3,
    }
    const directionsService = new this.google.maps.DirectionsService()
    const directionsRenderer = new this.google.maps.DirectionsRenderer({
      polylineOptions: routeLineOptions,
    })
    directionsRenderer.setOptions({
      map: this.map,
      markerOptions: this.markerOptions,
    })

    const waypoints = this.reservation.stops.map((stop) => {
      return {
        location: new this.google.maps.LatLng(
          Number(stop.address.lat),
          Number(stop.address.lng)
        ),
        stopover: true,
      }
    })
    for (const [waypointIndex, waypoint] of waypoints.entries()) {
      const iconImage = this.getIconImage(waypoints, waypointIndex)
      new this.google.maps.Marker({
        position: waypoint.location,
        icon: {
          url: iconImage,
          scaledSize: new this.google.maps.Size(20, 20),
        },
        map: this.map,
      })
    }

    const origin = waypoints.shift().location
    let destination = waypoints.pop().location

    if (origin.equals(destination)) {
      destination = waypoints.pop().location
    }

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: 'DRIVING',
      },
      function (response, status) {
        if (status === 'OK') {
          directionsRenderer.setDirections(response)
        } else {
          throw new Error('Directions request failed due to ' + status)
        }
      }
    )
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
