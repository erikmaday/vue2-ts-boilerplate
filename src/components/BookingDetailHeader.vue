<template>
  <v-row class="align-center">
    <v-col cols="auto">
      <CUSkeletonLoader
        v-if="loading"
        type="detail-text"
        width="80px"
        class="margin-y-1"
      />
      <span
        v-else
        class="d-flex-inline flex-shrink-1 white-space-nowrap font-14 margin-r-3"
      >
        <span class="text-gray-light">ID</span>
        {{ reservationId }}
      </span>
      <span
        v-if="actionMessage & !loading"
        class="d-flex-inline flex-shrink-1 white-space-nowrap font-medium text-error"
      >
        {{ actionMessage }}
      </span>
      <CUSkeletonLoader v-if="loading" width="220px" type="h1" />
      <h1 v-else class="margin-b-0">
        {{ firstPickupCity }} to {{ firstDropoffCity }}
      </h1>
    </v-col>
    <template v-if="needsAcceptance">
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          small
          text
          color="error"
          class="margin-r-2"
          @click="isDialogOpen = true"
        >
          Reject
        </v-btn>
        <v-btn small text color="primary" @click="accept">Accept</v-btn>
      </v-col>
    </template>
    <RejectBookingModal
      v-model="isDialogOpen"
      :reservation-id="reservation.reservationId"
    />
  </v-row>
</template>

<script lang="ts">
import {
  ReservationDetail,
  RequiredVehicleType,
  VehicleAssignment,
  ReservationDetailStop,
} from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ReferralStatus } from '@/utils/enum'
import reservation from '@/services/reservation'
import { isNotEmptyArray } from '@/utils/validators'
import RejectBookingModal from '@/components/RejectBookingModal.vue'

@Component({
  components: {
    RejectBookingModal,
  },
})
export default class BookingDetailHeader extends Vue {
  @Prop({ required: true }) readonly loading!: boolean
  @Prop({ required: true }) readonly reservation!: ReservationDetail
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]

  isDialogOpen = false

  isNotEmptyArray = isNotEmptyArray

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

  get firstPickup(): ReservationDetailStop {
    return this.reservation?.stops?.[0]
  }

  get firstDropoff(): ReservationDetailStop {
    return this.reservation?.stops?.[1] || this.firstPickup
  }

  get firstPickupCity(): string {
    return this.firstPickup?.address?.city
  }

  get firstDropoffCity(): string {
    return this.firstDropoff?.address?.city
  }

  async accept(): Promise<void> {
    await reservation.accept(this.reservation.reservationId)
    this.$emit('refresh')
  }
}
</script>
