<template>
  <div class="d-inline-flex margin-l-3 cursor-pointer align-center">
    <span v-if="showLabel" class="margin-r-5" :class="`text-${label.color}`">
      {{ label.text }}
    </span>
    <VehicleAssignmentIcon
      v-for="(vehicle, vehicleIndex) in vehicleAssignmentsToDisplay"
      :vehicle-assignment="vehicle"
      :key="`assigned-vehicle-${vehicleIndex}`"
      class="margin-l-n3"
    />
    <VehicleAssignmentIcon
      v-for="(vehicle, vehicleIndex) in unassignedToDisplay"
      :key="`unassigned-vehicle-${vehicleIndex}`"
      class="margin-l-n3"
    />
    <VehicleAssignmentIcon
      v-if="moreRequiredCount"
      :more-required-count="moreRequiredCount"
      class="margin-l-n3"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import VehicleAssignmentIcon from '@/components/VehicleAssignmentIcon.vue'
import { Reservation, Trip } from '@/models/dto'
import { VehicleAssignment } from '@/models/dto'
import { pluralize } from '@/utils/string'
import { ColoredMessage } from '@/models/ColoredMessage'
import trip from '@/services/trip'
import tripAssignment from '@/services/tripAssignment'

const MAX_DISPLAY = 3

@Component({
  components: {
    VehicleAssignmentIcon,
  },
})
export default class VehicleAssignmentIcons extends Vue {
  @Prop({ required: false }) readonly vehicleAssignments: VehicleAssignment[]
  @Prop({ required: false }) readonly trip: Trip
  @Prop({ required: false }) readonly reservation: Reservation
  @Prop({ required: false }) readonly showLabel: boolean
  @Prop({ required: false }) readonly row: Reservation

  fetchedTrip: Trip | null = null
  fetchedVehicleAssignments: VehicleAssignment[] = []

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

  get computedTrip(): Trip {
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

  get unassignedToDisplay(): number {
    const displayedAssignedVehicles =
      this.vehicleAssignmentsToDisplay?.length || 0
    return Math.min(
      this.totalRequiredVehicles - displayedAssignedVehicles,
      MAX_DISPLAY
    )
  }

  get moreRequiredCount(): number {
    const assignedVehiclesCount = this?.vehicleAssignmentsToDisplay?.length || 0
    const count =
      this.totalRequiredVehicles -
      assignedVehiclesCount -
      this.unassignedToDisplay
    if (count > 0) {
      return count
    }
    return 0
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
    return this.computedVehicleAssignments.length === this.totalRequiredVehicles
  }
}
</script>
