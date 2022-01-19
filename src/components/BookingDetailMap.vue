<template>
  <GmapMap
    ref="map"
    :center="center"
    :zoom="10"
    :options="options"
    class="w-full h-280"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapStyles } from '@/data/mapStyles'
import { gmapApi } from 'vue2-google-maps'
import { ReservationDetail, VehicleDetailEntity } from '@/models/dto'
import upcoming from '@/assets/images/stopIcons/upcoming.png'
import inprogress from '@/assets/images/stopIcons/inprogress.png'
import completed from '@/assets/images/stopIcons/completed.png'
import last from '@/assets/images/stopIcons/last.png'
import tracking from '@/services/tracking'
import { TrackingPoint } from '@/models/dto/Tracking'
import { toCamel } from '@/utils/string'
import { Journey, JourneyDriver } from '@/models/dto/Journey'

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
  trackingData: Map<number, TrackingPoint[]> = {}

  get google(): any {
    return gmapApi()
  }

  async mounted(): Promise<void> {
    await this.loadRouteData()
    await this.plotRoute()
    await this.loadTrackingData()
    this.plotTrackingData()
    this.plotVehicles()
  }

  async loadRouteData(): Promise<void> {
    const map = await (this as any).$refs.map.$mapPromise.then((map) => map)
    this.map = map
    const bounds = new this.google.maps.LatLngBounds()

    for (const stop of this.reservation.stops) {
      bounds.extend({ lat: stop.address.lat, lng: stop.address.lng })
    }
    this.map.fitBounds(bounds)
  }

  async loadTrackingData(): Promise<void> {
    const trackingData: Map<number, TrackingPoint[]> = {}
    for (const journey of this.reservation.journeys) {
      const response = await tracking.byReservationAndJourneyId({
        reservationId: journey.reservationId,
        journeyId: journey.journeyId,
        skip: 2,
      })
      trackingData[journey.journeyId] = response.data
    }
    this.trackingData = trackingData
  }

  plotTrackingData(): void {
    for (const journeyData of Object.values(this.trackingData)) {
      this.plotJourney(journeyData)
    }
  }

  plotJourney(journeyData: TrackingPoint[]): void {
    let previous = null
    for (const gpsPoint of journeyData) {
      this.plotGPSPoint(gpsPoint, previous)
      previous = gpsPoint
    }
  }

  plotGPSPoint(gpsPoint: TrackingPoint, previous: TrackingPoint): void {
    const position = new this.google.maps.LatLng(
      gpsPoint.latitude,
      gpsPoint.longitude
    )
    const markerIcon = {
      path: this.google.maps.SymbolPath.CIRCLE,
      fillColor: '#434343',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 4,
    }
    const marker = new this.google.maps.Marker({
      position: position,
      icon: markerIcon,
      title: gpsPoint.journey_id.toString(),
    })

    const infoWindow = new this.google.maps.InfoWindow({
      content: this.buildGPSPointInfoWindowContent(gpsPoint, previous),
      disableAutoPan: true,
    })
    marker.addListener('mouseover', () => {
      infoWindow.open(this.map, marker)
    })
    marker.addListener('mouseout', () => {
      infoWindow.close(this.map, marker)
    })
    marker.setMap(this.map)
  }

  buildGPSPointInfoWindowContent(
    gpsPoint: TrackingPoint,
    previous: TrackingPoint
  ): string {
    const timestamp = (this as any)
      .$dayjs(gpsPoint.current_time)
      .format('MM/DD/YYYY h:mm a z')

    const heading = this.calculateHeading(gpsPoint, previous)

    const speed = Math.round(gpsPoint.speed * 2.236)
    return `
            <div
              style="
                display: flex;
                align-items: center;
                flex-direction: column;
                line-height: 1.35;
                overflow: hidden;
                white-space: nowrap;
              "
            >
              <span>
                ${timestamp}
              </span>
              <span>
                ${speed}mph
              </span>
              ${
                heading !== null
                  ? `<svg height="24" viewBox="0 0 24 24" width="24" style="transform: rotate(${heading}deg);">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
                </svg>`
                  : ``
              }
            </div>`
  }

  plotVehicles(): void {
    for (const journeyData of Object.values(this.trackingData)) {
      this.plotVehicleLastLocation(journeyData)
    }
  }

  async plotVehicleLastLocation(journeyData: TrackingPoint[]): void {
    const gpsPoint = journeyData[0]
    const heading = this.calculateHeading(gpsPoint, journeyData[1])
    const journey = this.getJourney(gpsPoint.journey_id)
    const vehicle = journey.vehicle
    const vehicleType = toCamel(vehicle.vehicleTypeName)
    const icon = await this.makeVehicleIcon(vehicleType, heading)

    const marker = new this.google.maps.Marker({
      map: this.map,
      icon: icon,
      position: new this.google.maps.LatLng(
        gpsPoint.latitude,
        gpsPoint.longitude
      ),
    })

    const infoWindowContent = this.getVehicleInfoWindowContent(
      this.reservation.managedId,
      vehicle,
      journey.driver
    )
    const infoWindow = new this.google.maps.InfoWindow({
      content: infoWindowContent,
      disableAutoPan: true,
    })
    marker.addListener('mouseover', () => {
      infoWindow.open(this.map, marker)
    })
    marker.addListener('mouseout', () => {
      infoWindow.close(this.map, marker)
    })
  }

  getJourney(journeyId: number): Journey {
    return this.reservation.journeys.find(
      (journey) => journey.journeyId === journeyId
    )
  }

  async makeVehicleIcon(
    vehicleType: string,
    heading: number
  ): Promise<{ url: any; scaledSize: any; anchor: any }> {
    vehicleType = this.getIconVehicleType(vehicleType)
    let url = await import(
      `@/assets/images/trackingIcons/${vehicleType}/${heading}.svg`
    )
    url = url.default
    let scaledSize = null
    let anchor = null
    if (vehicleType === 'charterBus') {
      scaledSize = new this.google.maps.Size(65, 65)
      anchor = new this.google.maps.Point(32.5, 32.5)
    } else if (vehicleType === 'sprinter') {
      scaledSize = new this.google.maps.Size(45, 45)
      anchor = new this.google.maps.Point(22.5, 22.5)
    } else if (vehicleType === 'miniBus') {
      scaledSize = new this.google.maps.Size(57, 57)
      anchor = new this.google.maps.Point(28.5, 28.5)
    }
    return { url, scaledSize, anchor }
  }

  getVehicleInfoWindowContent(
    reservationId: string,
    vehicle: VehicleDetailEntity,
    currentDriver: JourneyDriver
  ): string {
    const { vehicleMake, vehicleModel, vehicleTypeName, vehicleName } = vehicle
    const { firstName = 'No Driver', lastName = 'Assigned' } =
      currentDriver || {}
    const phone = currentDriver?.driverInfo?.phone || ''
    return `
              <table>
                <tr>
                  <td colspan=2>Reservation #: ${reservationId}</td>
                </tr>
                <tr>
                  <td colspan=2><hr/></td>
                </tr>
                <tr>
                  <td>${vehicleName}<br/>${vehicleMake} ${vehicleModel}<br/><small>${vehicleTypeName}</small></td>
                </tr>
                <tr>
                  <td>${firstName} ${lastName}<br/><small>${phone}</small></td>
                </tr>
              </table>
            `
  }

  getIconVehicleType(vehicleType: string): string {
    if (vehicleType) {
      vehicleType = toCamel(vehicleType)
    }
    if (!['charterBus', 'sprinter', 'miniBus'].includes(vehicleType)) {
      vehicleType = 'charterBus'
    }
    return vehicleType
  }

  calculateHeading(current: TrackingPoint, previous: TrackingPoint): number {
    let heading = 0
    if (previous) {
      const pointA = new this.google.maps.LatLng(
        previous.latitude,
        previous.longitude
      )
      const pointB = new this.google.maps.LatLng(
        current.latitude,
        current.longitude
      )

      heading = this.google.maps.geometry.spherical.computeHeading(
        pointA,
        pointB
      )
      if (heading < 0) {
        heading = Math.abs(heading * 2)
      }
      // round to nearest 10.
      if (heading !== 0) {
        heading = (parseInt(heading / 10, 10) + 1) * 10
        heading = heading % 360
      }
    }
    return heading
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

  getIconImage(
    waypoints: { location: any; stopover: boolean }[],
    waypointIndex: number
  ): any {
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
