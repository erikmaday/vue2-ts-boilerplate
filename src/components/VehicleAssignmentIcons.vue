<template>
  <div class="d-inline-flex margin-l-3 cursor-pointer">
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
import CUIcon from '@/components/CUIcon.vue'
import VehicleAssignmentIcon from '@/components/VehicleAssignmentIcon.vue'
import { Reservation } from '@/models/dto'
import { VehicleAssignment } from '@/models/dto'

const MAX_DISPLAY = 3

@Component({
  components: {
    CUIcon,
    VehicleAssignmentIcon,
  },
})
export default class VehicleAssignmentIcons extends Vue {
  @Prop() readonly reservation!: Reservation

  get totalRequiredVehicles(): number {
    return this.reservation.trip.vehicles.reduce(
      (sum, vehicle) => sum + vehicle.quantity,
      0
    )
  }

  get vehicleAssignmentsToDisplay(): VehicleAssignment[] | undefined {
    if (this?.reservation?.vehicleAssignments) {
      return this.reservation.vehicleAssignments.slice(0, MAX_DISPLAY)
    }
    return this?.reservation?.vehicleAssignments
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
}
</script>
