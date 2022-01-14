<template>
  <v-tooltip top>
    <template #activator="{ on }">
      <div
        class="d-inline-flex margin-l-3 cursor-pointer align-center"
        v-on="on"
        @click="isDialogOpen = true"
      >
        <span
          v-if="showLabel"
          class="margin-r-5"
          :class="`text-${label.color}`"
        >
          {{ label.text }}
        </span>
        <DriverAssignmentIcon
          v-for="(driver, driverIndex) in driverAssignmentsToDisplay"
          :driver-assignment="driver"
          :key="`assigned-driver-${driverIndex}`"
          class="margin-l-n3"
        />
        <DriverAssignmentIcon
          v-for="driverIndex in unassignedToDisplay"
          :key="`unassigned-driver-${driverIndex}`"
          class="margin-l-n3"
        />
        <DriverAssignmentIcon
          v-if="moreRequiredCount"
          :more-required-count="moreRequiredCount"
          class="margin-l-n3"
        />
        <template
          v-if="
            !!computedTrip &&
            !!computedReservation &&
            !!computedVehicleAssignments
          "
        >
          <TripAssignmentsModal
            v-model="isDialogOpen"
            :reservationId="computedReservation.reservationId"
            :tripAssignments="computedVehicleAssignments"
            :trip="computedTrip"
            @refresh="EventBus.$emit('refresh-assignments')"
          />
        </template>
      </div>
    </template>
    <span v-html="tooltipBody"></span>
  </v-tooltip>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import VehicleAssignmentIcon from '@/components/VehicleAssignmentIcon.vue'
import DriverAssignmentIcon from '@/components/DriverAssignmentIcon.vue'
import { VehicleAssignment, Trip, Reservation } from '@/models/dto'
import { DriverAssignment } from '@/models/dto/DriverAssignment'
import { pluralize } from '@/utils/string'
import { ColoredMessage } from '@/models/ColoredMessage'
import trip from '@/services/trip'
import tripAssignment from '@/services/tripAssignment'
import TripAssignmentsModal from '@/components/TripAssignmentsModal.vue'
import { EventBus } from '@/utils/eventBus'

const MAX_DISPLAY = 3

@Component({
  components: {
    VehicleAssignmentIcon,
    DriverAssignmentIcon,
    TripAssignmentsModal,
  },
})
export default class DriverAssignmentIcons extends Vue {
  @Prop({ required: false }) readonly vehicleAssignments: VehicleAssignment[]
  @Prop({ required: false }) readonly trip: Trip
  @Prop({ required: false }) readonly reservation: Reservation
  @Prop({ required: false }) readonly showLabel: boolean
  @Prop({ required: false }) readonly row: Reservation

  fetchedTrip: Trip | null = null
  fetchedVehicleAssignments: VehicleAssignment[] = []
  isDialogOpen = false
  EventBus = EventBus

  @Watch('computedReservation', { immediate: true })
  async reservationChanged(reservation: Reservation): Promise<void> {
    if (!this.trip) {
      const tripResponse = await trip.byId(reservation.tripId)
      this.fetchedTrip = tripResponse.data.trip
    }
    if (!this.vehicleAssignments && reservation?.reservationId) {
      const tripAssignmentResponse = await tripAssignment.byReservationIds([
        reservation.reservationId,
      ])
      this.fetchedVehicleAssignments =
        tripAssignmentResponse.data.vehicleAssignments
    }
  }

  mounted(): void {
    EventBus.$on('refresh-assignments', () => this.refreshAssignments())
  }

  async refreshAssignments(): Promise<void> {
    const tripAssignmentResponse = await tripAssignment.byReservationIds([
      this.reservation.reservationId,
    ])
    this.fetchedVehicleAssignments =
      tripAssignmentResponse.data.vehicleAssignments
  }

  get computedTrip(): Trip | null {
    return this.trip ? this.trip : this.fetchedTrip
  }

  get computedVehicleAssignments(): VehicleAssignment[] {
    return this.vehicleAssignments
      ? this.vehicleAssignments
      : this.fetchedVehicleAssignments
  }

  get computedReservation(): Reservation | null {
    if (this.reservation) {
      return this.reservation
    }
    if (this.row) {
      return this.row
    }
    return null
  }

  get totalRequiredDrivers(): number {
    if (!this.computedTrip?.requiredDrivers) {
      return 0
    }
    return Math.max(
      this.totalRequiredVehicles,
      this.computedTrip.requiredDrivers
    )
  }

  get totalRequiredVehicles(): number {
    if (this.computedTrip) {
      return this.computedTrip.vehicles.reduce(
        (sum, vehicle) => sum + vehicle.quantity,
        0
      )
    }
    return 0
  }

  get driverAssignments(): DriverAssignment[] {
    return this.computedVehicleAssignments.reduce(
      (prev, { driverAssignments }) => [...prev, ...driverAssignments],
      []
    )
  }

  get driverAssignmentsToDisplay(): DriverAssignment[] {
    return this.driverAssignments.slice(0, MAX_DISPLAY)
  }

  get unassignedToDisplay(): number {
    const min = Math.min(
      this.totalRequiredDrivers - this.driverAssignmentsToDisplay.length,
      MAX_DISPLAY
    )
    return Math.max(min, 0)
  }

  get moreRequiredCount(): number {
    const count =
      this.totalRequiredDrivers -
      this.driverAssignmentsToDisplay.length -
      this.unassignedToDisplay
    if (count > 0) {
      return count
    }
    return 0
  }

  get label(): ColoredMessage {
    const count = this.totalRequiredDrivers
    const noun = pluralize(this.totalRequiredDrivers, 'Driver')
    return {
      text: `${count} ${noun}`,
      color: !this.isFullyAssigned ? 'red' : 'black',
    }
  }

  get isFullyAssigned(): boolean {
    return this.driverAssignments.length === this.totalRequiredDrivers
  }

  get tooltipBody(): string {
    const start = `<p class="text-white margin-a-0">`
    const end = `</p>`
    const line = (str: string): string => `${start}${str}${end}`

    if (this.computedVehicleAssignments?.length) {
      let html = ''
      for (const vehicleAssignment of this.computedVehicleAssignments) {
        for (const driverAssignment of vehicleAssignment.driverAssignments) {
          html += line(
            `${driverAssignment.driver.firstName} ${driverAssignment.driver.lastName}`
          )
        }
      }
      return html
    } else {
      return line('No Drivers Assigned')
    }
  }
}
</script>
