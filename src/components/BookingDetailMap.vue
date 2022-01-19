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
import { ReservationDetail, VehicleDetailEntity } from '@/models/dto'
import upcoming from '@/assets/images/stopIcons/upcoming.png'
import inprogress from '@/assets/images/stopIcons/inprogress.png'
import completed from '@/assets/images/stopIcons/completed.png'
import last from '@/assets/images/stopIcons/last.png'
import tracking from '@/services/tracking'
import { TrackingPoint } from '@/models/dto/Tracking'
import { toCamel } from '@/utils/string'
import { Journey } from '@/models/dto/Journey'

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

  plotVehicleLastLocation(journeyData: TrackingPoint[]): void {
    const gpsPoint = journeyData[0]
    const heading = this.calculateHeading(gpsPoint, journeyData[1])
    const journey = this.getJourney(gpsPoint.journey_id)
    const vehicle = journey.vehicle
    const vehicleType = toCamel(vehicle.vehicleName)
    const icon = this.makeVehicleIcon(vehicleType, heading)

    const marker = new this.google.maps.Marker({
      map: this.map,
      icon,
      position: new this.google.maps.LatLng(
        gpsPoint.latitude,
        gpsPoint.longitude
      ),
    })

    const infoWindowContent = this.getVehicleInfoWindowContent(
      journey.reservationId,
      vehicle,
      journey.driver
    )
    const infoWindow = new this.google.maps.InfoWindow({
      content: infoWindowContent,
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
  ): Promise<{ url: any; scaledSize: any }> {
    vehicleType = this.getIconVehicleType(vehicleType)
    const url = await import(
      `@/assets/images/trackingIcons/${vehicleType}/${heading}.svg`
    )
    let size = null
    if (vehicleType === 'charterBus') {
      size = [65, 65]
    } else if (vehicleType === 'sprinter') {
      size = [45, 45]
    } else if (vehicleType === 'miniBus') {
      size = [57, 57]
    }
    return { url, scaledSize: new this.google.maps.Size(...size) }
  }

  getVehicleInfoWindowContent(reservationId, vehicle, currentDriver): string {
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
                  <td>
                    <svg version="1.1" width="13" height="13" viewBox="0 0 32 32">
                    <title>vehicles</title>
                    <path d="M23.735 32.061c-1.681 0-3.047-1.374-3.047-3.057v-1.275h-9.373v1.275c0 1.683-1.365 3.057-3.048 3.057-1.681 0-3.049-1.374-3.049-3.057v-1.275h-3.048v-11.727c0-2.945 1.526-11.753 1.589-12.127 0.606-2.697 4.494-3.936 12.24-3.936 7.751 0 11.639 1.238 12.234 3.892 0.075 0.417 1.599 9.225 1.599 12.171v11.727h-3.048v1.275c0 1.683-1.37 3.057-3.049 3.057zM9.529 25.944h12.943v3.060c0 0.713 0.555 1.277 1.263 1.277 0.709 0 1.265-0.563 1.265-1.277v-3.060h3.049v-9.943c0-2.792-1.549-11.731-1.564-11.823-0.158-0.707-1.523-2.454-10.481-2.454-8.964 0-10.327 1.748-10.496 2.498-0.007 0.048-1.553 8.989-1.553 11.779v9.943h3.046v3.060c0 0.713 0.557 1.277 1.265 1.277s1.263-0.563 1.263-1.277v-3.060zM23.733 24.474c-1.683 0-3.050-1.37-3.050-3.055 0-1.687 1.367-3.058 3.050-3.058 1.679 0 3.048 1.371 3.048 3.058 0 1.685-1.37 3.055-3.048 3.055zM23.733 20.145c-0.71 0-1.264 0.559-1.264 1.274 0 0.711 0.553 1.273 1.264 1.273 0.708 0 1.264-0.563 1.264-1.273-0.001-0.715-0.557-1.274-1.264-1.274zM8.266 24.474c-1.681 0-3.049-1.37-3.049-3.055 0-1.687 1.368-3.058 3.049-3.058 1.683 0 3.048 1.371 3.048 3.058 0 1.685-1.365 3.055-3.048 3.055zM8.266 20.145c-0.708 0-1.265 0.559-1.265 1.274 0 0.711 0.557 1.273 1.265 1.273s1.263-0.563 1.263-1.273c0-0.715-0.554-1.274-1.263-1.274zM24.942 16.892h-17.716c-0.58 0-1.129-0.255-1.503-0.699-0.381-0.449-0.539-1.046-0.437-1.633l0.872-6.471c0.199-0.979 1.013-1.649 1.949-1.649h15.623c0.932 0 1.747 0.669 1.936 1.59l0.003 0.016 1.212 6.502c0.101 0.597-0.055 1.195-0.437 1.645-0.369 0.445-0.917 0.699-1.503 0.699zM8.109 8.225c-0.095 0-0.171 0.066-0.19 0.163l-0.867 6.442c-0.023 0.129 0.015 0.187 0.039 0.215 0.035 0.041 0.080 0.061 0.136 0.061h17.716c0.059 0 0.106-0.021 0.141-0.061 0.029-0.034 0.058-0.091 0.041-0.181l-1.207-6.48c-0.021-0.093-0.097-0.157-0.187-0.157h-15.623zM21.391 5.163h-10.785c-0.491 0-0.89-0.399-0.89-0.89 0-0.493 0.399-0.893 0.89-0.893h10.785c0.492 0 0.891 0.401 0.891 0.893 0 0.491-0.399 0.89-0.891 0.89z"></path>
                    </svg>

                  </td>
                  <td>${vehicleName}<br/>${vehicleMake} ${vehicleModel}<br/><small>${vehicleTypeName}</small></td>
                </tr>
                <tr>
                  <td>
                    <svg width="13" height="13" viewBox="0 0 32 32">
                      <title>drivers</title>
                    <path d="M28.941 19.495c0-2.841-3.76-5.102-9.198-5.815 0.97-0.965 1.574-2.298 1.574-3.773 0-0.492-0.403-0.89-0.896-0.89s-0.887 0.398-0.887 0.89c0 1.949-1.584 3.53-3.533 3.53-1.942 0-3.525-1.581-3.525-3.53 0-0.492-0.403-0.89-0.895-0.89s-0.888 0.398-0.888 0.89c0 1.475 0.597 2.807 1.572 3.773-5.445 0.713-9.207 2.973-9.207 5.815 0 1.523 1.121 2.931 3.141 4.011-0.013 0.112-0.037 0.223-0.037 0.341 0 1.474 1.064 2.699 2.467 2.961l0.081 0.189c1.26 2.915 4.129 4.803 7.311 4.803 3.079 0 5.907-1.809 7.211-4.61 0.057-0.123 0.080-0.239 0.081-0.367 1.483-0.183 2.645-1.441 2.645-2.977 0-0.139-0.022-0.266-0.041-0.403 1.95-1.069 3.023-2.451 3.023-3.949zM9.185 22.605c0.687 0 1.242 0.555 1.242 1.243 0 0.678-0.555 1.234-1.242 1.234-0.681 0-1.238-0.556-1.238-1.234-0.001-0.688 0.557-1.243 1.238-1.243zM16.023 30.017c-2.286 0-4.367-1.257-5.44-3.249 0.005-0.037 0.009-0.074 0.009-0.109 0-0.051-0.020-0.095-0.029-0.143 0.97-0.501 1.645-1.503 1.645-2.669 0-1.203-0.709-2.231-1.719-2.719 1.035-2.105 3.169-3.463 5.533-3.463 2.355 0 4.517 1.371 5.547 3.498-0.984 0.501-1.659 1.505-1.659 2.684 0 1.17 0.675 2.174 1.661 2.675-1.028 2.124-3.193 3.495-5.548 3.495zM22.934 25.081c-0.681 0-1.241-0.556-1.241-1.234 0-0.688 0.559-1.243 1.241-1.243 0.686 0 1.242 0.555 1.242 1.243 0.001 0.678-0.555 1.234-1.242 1.234zM25.175 21.825c-0.473-0.523-1.127-0.873-1.861-0.967 0-0.119-0.025-0.245-0.081-0.364-1.303-2.802-4.131-4.612-7.209-4.612-3.179 0-6.048 1.887-7.31 4.808-0.025 0.060-0.027 0.119-0.039 0.182-0.702 0.121-1.318 0.483-1.762 0.997-1.319-0.725-2.069-1.577-2.069-2.375 0-2.023 4.581-4.273 11.159-4.273 6.576 0 11.155 2.249 11.155 4.273-0.001 0.783-0.717 1.614-1.983 2.331zM17.954 24.53c0.069-0.211 0.122-0.441 0.122-0.682 0-0.822-0.484-1.534-1.18-1.867v-1.781c0-0.495-0.403-0.893-0.896-0.893-0.492 0-0.887 0.399-0.887 0.893v1.781c-0.704 0.333-1.187 1.045-1.187 1.867 0 0.241 0.051 0.471 0.129 0.682l-1.261 1.251c-0.344 0.353-0.345 0.914-0.001 1.262 0.179 0.178 0.406 0.262 0.635 0.262s0.453-0.084 0.633-0.26l1.256-1.252c0.215 0.079 0.442 0.13 0.684 0.13s0.472-0.051 0.687-0.13l1.279 1.263c0.171 0.177 0.397 0.26 0.624 0.26s0.459-0.085 0.635-0.265c0.343-0.344 0.341-0.909-0.005-1.261l-1.267-1.259zM15.708 23.847c0-0.165 0.135-0.289 0.292-0.289 0.162 0 0.292 0.124 0.292 0.289 0 0.155-0.13 0.289-0.292 0.289-0.155 0-0.292-0.133-0.292-0.289zM8.869 5.429v0.726c0 0.192 0.055 0.376 0.173 0.532 0.299 0.399 1.681 1.705 7.095 1.705 5.405 0 6.787-1.308 7.085-1.705 0.117-0.157 0.181-0.34 0.181-0.532v-0.727c0.997-0.741 1.287-1.978 1.323-2.134 0.093-0.467-0.192-0.929-0.653-1.049l-7.711-2.016c-0.153-0.038-0.305-0.038-0.457 0l-7.721 2.016c-0.46 0.119-0.746 0.582-0.641 1.050 0.035 0.157 0.318 1.393 1.325 2.134zM16.137 2.014l6.479 1.692c-0.127 0.168-0.278 0.318-0.47 0.401-0.319 0.142-0.527 0.463-0.527 0.815v0.801c-0.503 0.286-1.957 0.886-5.481 0.886-3.581 0-5.029-0.615-5.485-0.875v-0.812c0-0.352-0.209-0.673-0.533-0.815-0.194-0.083-0.346-0.233-0.465-0.402l6.483-1.69z"></path>
                    </svg>
                  </td>
                  <td>${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>${phone}</td>
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
