<template>
  <div>
    <template v-if="$vuetify.breakpoint.smAndUp || !enableMobileView">
      <v-tooltip top>
        <template #activator="{ on }">
          <div
            class="d-inline-flex margin-l-3 align-center"
            v-on="on"
            @click="openDialogue"
            :class="{
              'cursor-pointer': !needsAcceptance,
              'cursor-not-allowed': needsAcceptance,
            }"
          >
            <span
              v-if="showLabel"
              class="margin-r-5"
              :class="`text-${label.color}`"
            >
              {{ label.text }}
            </span>
            <VehicleAssignmentIcon
              v-for="(vehicle, vehicleIndex) in vehicleAssignmentsToDisplay"
              :vehicle-assignment="vehicle"
              :key="`assigned-vehicle-${vehicleIndex}`"
              class="margin-l-n3"
            />
            <VehicleAssignmentIcon
              v-for="vehicleIndex in unassignedToDisplay"
              :key="`unassigned-vehicle-${vehicleIndex}`"
              class="margin-l-n3"
            />
            <VehicleAssignmentIcon
              v-if="undisplayedCount"
              :undisplayed-count="undisplayedCount"
              :is-fully-assigned="isFullyAssigned"
              class="margin-l-n3"
            />
          </div>
        </template>
        <span class="text-white" v-html="tooltipBody"></span>
      </v-tooltip>
    </template>
    <template v-else>
      <div class="d-flex flex-column">
        <h4>Vehicle Assignments</h4>
        <div class="text-left">
          <span v-html="vehicleAssignmentMobileBody"></span>
        </div>
      </div>
    </template>
    <template
      v-if="computedTrip && computedReservation && computedVehicleAssignments"
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
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import VehicleAssignmentIcon from '@/components/VehicleAssignmentIcon.vue'
import TripAssignmentsModal from '@/components/TripAssignmentsModal.vue'
import { Reservation, Trip } from '@/models/dto'
import { VehicleAssignment } from '@/models/dto'
import { pluralize } from '@/utils/string'
import { ReferralStatus } from '@/utils/enum'
import { ColoredMessage } from '@/models/ColoredMessage'
import trip from '@/services/trip'
import tripAssignment from '@/services/tripAssignment'
import { EventBus } from '@/utils/eventBus'

const MAX_DISPLAY = 3

@Component({
  components: {
    VehicleAssignmentIcon,
    TripAssignmentsModal,
  },
})
export default class VehicleAssignmentIcons extends Vue {
  @Prop({ required: false }) readonly vehicleAssignments: VehicleAssignment[]
  @Prop({ required: false }) readonly trip: Trip
  @Prop({ required: false }) readonly reservation: Reservation
  @Prop({ required: false }) readonly showLabel: boolean
  @Prop({ required: false, default: false }) readonly enableMobileView: boolean

  fetchedTrip: Trip | null = null
  fetchedVehicleAssignments: VehicleAssignment[] = []
  isDialogOpen = false
  EventBus = EventBus

  mounted(): void {
    EventBus.$on('refresh-assignments', () => this.refreshAssignments())
  }

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

  async refreshAssignments(): Promise<void> {
    const tripAssignmentResponse = await tripAssignment.byReservationIds([
      this.reservation.reservationId,
    ])
    this.fetchedVehicleAssignments =
      tripAssignmentResponse.data.vehicleAssignments
  }

  openDialogue(): void {
    if (!this.needsAcceptance) {
      this.isDialogOpen = true
    }
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
    return null
  }

  get totalRequiredVehicles(): number {
    if (!this.computedTrip?.vehicles) {
      return 0
    }
    return this.computedTrip?.vehicles.reduce(
      (sum, vehicle) => sum + vehicle.quantity,
      0
    )
  }

  get vehicleAssignmentsToDisplay(): VehicleAssignment[] {
    let vehicleAssignments = []
    if (this.computedVehicleAssignments) {
      vehicleAssignments = this.computedVehicleAssignments.slice(0, MAX_DISPLAY)
    }
    return vehicleAssignments
  }

  get undisplayedCount(): number {
    const count = this.totalRequiredVehicles - MAX_DISPLAY
    return Math.max(count, 0)
  }

  get unassignedToDisplay(): number {
    const displayedAssignedVehicles =
      this.vehicleAssignmentsToDisplay?.length || 0
    const min = Math.min(MAX_DISPLAY - displayedAssignedVehicles, MAX_DISPLAY)
    return Math.max(min, 0)
  }

  get label(): ColoredMessage {
    const count = this.totalRequiredVehicles
    const noun = pluralize(this.totalRequiredVehicles, 'Vehicle')
    return {
      text: `${count} ${noun}`,
      color: !this.isFullyAssigned ? 'red' : 'black',
    }
  }

  get isFullyAssigned(): boolean {
    return (
      this.computedVehicleAssignments?.length === this.totalRequiredVehicles
    )
  }

  get needsAcceptance(): boolean {
    return this.reservation?.referralStatus === ReferralStatus.Offered
  }

  get tooltipBody(): string {
    const start = `<p class="text-white margin-a-0">`
    const end = `</p>`
    const line = (str: string): string => `${start}${str}${end}`

    if (this.needsAcceptance) {
      return line('Accept the booking to start') + line('assigning vehicles')
    }

    if (this.computedVehicleAssignments?.length) {
      let html = ''
      for (const vehicleAssignment of this.computedVehicleAssignments) {
        html += line(vehicleAssignment.vehicle.vehicleName)
      }
      return html
    } else {
      return line('No Vehicles Assigned')
    }
  }

  get vehicleAssignmentMobileBody(): string {
    const assignmentLine = (str: string) => `<p class="margin-a-0">${str}</p>`
    const unassignedLine = `<p class="text-error margin-a-0">Unassigned Vehicle</p>`

    let html = ''
    for (const vehicleAssignment of this.computedVehicleAssignments) {
      html += assignmentLine(vehicleAssignment.vehicle.vehicleName)
    }

    const unassignedVehicleNumber =
      this.totalRequiredVehicles - this.computedVehicleAssignments.length
    if (unassignedVehicleNumber > 0) {
      for (let i = 0; i < unassignedVehicleNumber; i++) {
        html += unassignedLine
      }
    }

    return html
  }
}
</script>
