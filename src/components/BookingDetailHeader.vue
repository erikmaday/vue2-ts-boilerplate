<template>
  <div class="w-full">
    <span
      class="d-flex-inline flex-shrink-1 white-space-nowrap font-14 margin-r-3"
    >
      <span class="text-gray-light">ID</span>
      {{ reservationId }}
    </span>
    <span
      v-if="actionMessage"
      class="
        d-flex-inline
        flex-shrink-1
        white-space-nowrap
        font-medium
        text-error
      "
    >
      {{ actionMessage }}
    </span>
    <h1>{{ firstPickupCity }} to {{ firstDropoffCity }}</h1>
  </div>
</template>

<script lang="ts">
import {
  ReservationDetail,
  RequiredVehicleType,
  VehicleAssignment,
  Stop,
} from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ReferralStatus } from '@/utils/enum'

@Component
export default class BookingDetailHeader extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]

  get reservationId(): string {
    return this.reservation?.managedId
  }

  get needsAssignment(): boolean {
    return !(
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

  get needsAcceptance(): boolean {
    return this.reservation?.referralStatus === ReferralStatus.Offered
  }

  get actionMessage(): string | null {
    if (this.needsAcceptance) {
      return 'Needs Acceptance'
    }
    if (this.needsAssignment) {
      return 'Needs Assignment'
    }
    return null
  }

  get firstPickup(): Stop {
    return this.reservation?.stops?.[0]
  }

  get firstDropoff(): Stop {
    return this.reservation?.stops?.[1] || this.firstPickup
  }

  get firstPickupCity(): string {
    return this.firstPickup?.address?.city
  }

  get firstDropoffCity(): string {
    return this.firstDropoff?.address?.city
  }
}
</script>
