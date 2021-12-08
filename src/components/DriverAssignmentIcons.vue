<template>
  <div>
    <div class="d-inline-flex margin-l-3 cursor-pointer">
      <DriverAssignmentIcon
        v-for="(driver, driverIndex) in driverAssignmentsToDisplay"
        :driver-assignment="driver"
        :key="`assigned-driver-${driverIndex}`"
        class="margin-l-n3"
      />
      <DriverAssignmentIcon
        v-for="(driver, driverIndex) in unassignedToDisplay"
        :key="`unassigned-driver-${driverIndex}`"
        class="margin-l-n3"
      />
      <DriverAssignmentIcon
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
import DriverAssignmentIcon from '@/components/DriverAssignmentIcon.vue'
import { Reservation } from '@/models/dto'
import { DriverAssignment } from '@/models/dto/DriverAssignment'

const MAX_DISPLAY = 3

@Component({
  components: {
    CUIcon,
    VehicleAssignmentIcon,
    DriverAssignmentIcon,
  },
})
export default class DriverAssignmentIcons extends Vue {
  @Prop() readonly reservation!: Reservation
  @Prop({ default: false, required: false }) vehiclesOnly!: boolean
  @Prop({ default: false, required: false }) driversOnly!: boolean

  get totalRequiredDrivers(): number {
    return this.reservation.trip.requiredDrivers
  }

  get driverAssignments(): DriverAssignment[] {
    const driverAssignments: DriverAssignment[] = []
    for (const vehicleAssignment of this.reservation.vehicleAssignments) {
      for (const driverAssignment of vehicleAssignment.driverAssignments) {
        driverAssignments.push(driverAssignment)
      }
    }
    return driverAssignments
  }

  get driverAssignmentsToDisplay(): DriverAssignment[] {
    return this.driverAssignments.slice(0, MAX_DISPLAY)
  }

  get unassignedToDisplay(): number[] {
    return Math.min(
      this.totalRequiredDrivers - this.driverAssignmentsToDisplay.length,
      MAX_DISPLAY
    )
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
}
</script>
