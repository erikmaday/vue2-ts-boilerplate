<template>
  <div class="d-inline-flex margin-l-3 cursor-pointer align-center">
    <span v-if="showLabel" class="margin-r-5" :class="`text-${label.color}`">
      {{ label.text }}
    </span>
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
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import VehicleAssignmentIcon from '@/components/VehicleAssignmentIcon.vue'
import DriverAssignmentIcon from '@/components/DriverAssignmentIcon.vue'
import { Reservation, VehicleAssignment, Trip } from '@/models/dto'
import { DriverAssignment } from '@/models/dto/DriverAssignment'
import { pluralize } from '@/utils/string'
import { ColoredMessage } from '@/models/ColoredMessage'

const MAX_DISPLAY = 3

@Component({
  components: {
    VehicleAssignmentIcon,
    DriverAssignmentIcon,
  },
})
export default class DriverAssignmentIcons extends Vue {
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

  get totalRequiredDrivers(): number {
    return Math.max(
      this.totalRequiredVehicles,
      this.computedTrip.requiredDrivers
    )
  }

  get totalRequiredVehicles(): number {
    if (this.trip) {
      return this.computedTrip.vehicles.reduce(
        (sum, vehicle) => sum + vehicle.quantity,
        0
      )
    }
    return this.reservation?.requiredVehiclesCount
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
}
</script>
