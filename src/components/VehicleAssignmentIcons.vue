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
import { Component, Vue, Prop } from 'vue-property-decorator'
import VehicleAssignmentIcon from '@/components/VehicleAssignmentIcon.vue'
import { Reservation, Trip } from '@/models/dto'
import { VehicleAssignment } from '@/models/dto'
import { pluralize } from '@/utils/string'
import { ColoredMessage } from '@/models/ColoredMessage'

const MAX_DISPLAY = 3

@Component({
  components: {
    VehicleAssignmentIcon,
  },
})
export default class VehicleAssignmentIcons extends Vue {
  @Prop({ required: false }) readonly reservation: Reservation
  @Prop({ required: false }) readonly vehicleAssignments: VehicleAssignment[]
  @Prop({ required: false }) readonly trip: Trip
  @Prop({ required: false }) readonly showLabel: boolean

  get computedTrip(): Trip {
    return this.trip ? this.trip : this.reservation.trip
  }

  get computedVehicleAssignments(): Trip {
    return this.vehicleAssignments
      ? this.vehicleAssignments
      : this.reservation.vehicleAssignments
  }

  get totalRequiredVehicles(): number {
    return this.computedTrip.vehicles.reduce(
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
