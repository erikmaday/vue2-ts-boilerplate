<template>
  <v-row dense class="font-12 align-end">
    <v-col>
      1/3 Accept the Job
      <div
        class="h-10 w-full"
        :class="{
          'background-primary': isAccepted,
          'background-gray-mid-light': !isAccepted,
        }"
      />
    </v-col>
    <v-col>
      2/3 Assign Drivers and Vehicles
      <div
        class="h-10 w-full"
        :class="{
          'background-primary': isFullyAssigned,
          'background-gray-mid-light': !isFullyAssigned,
        }"
      />
    </v-col>
    <v-col>
      3/3 Driver Tracking via Mobile App
      <div
        class="h-10 w-full"
        :class="{
          'background-primary': isTracked,
          'background-gray-mid-light': !isTracked,
        }"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  ReservationDetail,
  RequiredVehicleType,
  VehicleAssignment,
} from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ReferralStatus } from '@/utils/enum'
@Component
export default class BookingDetailStepTimeline extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]

  get isAccepted(): boolean {
    return this.reservation?.referralStatus === ReferralStatus.Accepted
  }

  get isFullyAssigned(): boolean {
    return (
      this.assignedVehicleCount === this.requiredVehicleCount &&
      this.assignedDriverCount === this.reservation?.requiredDrivers
    )
  }

  get assignedVehicleCount(): number {
    return this.tripAssignments.length
  }

  get requiredVehicleCount(): number {
    if (!this.reservation?.requiredVehicles) {
      return 0
    }
    return this.reservation.requiredVehicles.reduce(
      (sum, vehicleType: RequiredVehicleType) => sum + vehicleType.quantity,
      0
    )
  }

  get assignedDriverCount(): number {
    return this.tripAssignments.reduce(
      (sum, tripAssignment) =>
        sum + (tripAssignment.driverAssignments.length || 0),
      0
    )
  }

  get isTracked(): boolean {
    return !!this.reservation?.hasTrackingData
  }
}
</script>
