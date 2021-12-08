<template>
  <div>
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
    let count = 0
    for (const vehicle of this.reservation.trip.vehicles) {
      count += vehicle.quantity
    }
    return count
  }

  get vehicleAssignmentsToDisplay(): VehicleAssignment[] {
    return this.reservation.vehicleAssignments.slice(0, MAX_DISPLAY)
  }

  get unassignedToDisplay(): number[] {
    return Math.min(
      this.totalRequiredVehicles - this.vehicleAssignmentsToDisplay.length,
      MAX_DISPLAY
    )
  }

  get moreRequiredCount(): number {
    const count =
      this.totalRequiredVehicles -
      this.vehicleAssignmentsToDisplay.length -
      this.unassignedToDisplay
    if (count > 0) {
      return count
    }
    return 0
  }
}
</script>
