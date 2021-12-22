<template>
  <v-row class="align-center">
    <v-col cols="auto">
      <span
        class="
          d-flex-inline
          flex-shrink-1
          white-space-nowrap
          font-14
          margin-r-3
        "
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
      <h1 class="margin-b-0">
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
    <CUModal v-model="isDialogOpen">
      <template #title>Reject Booking</template>
      <template #label>Why are you rejecting the booking?</template>
      <template #text>
        <v-form ref="form">
          <CUTextField
            v-model="confirmPassword"
            label="Confirm New Password"
            :rules="[(val) => passwordsMatch(val) || 'Passwords must match']"
            validate-on-blur
          />
        </v-form>
        <v-textarea
          v-model="rejectComment"
          placeholder="Add reasons for rejection here."
          auto-grow
          outlined
        ></v-textarea>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" small text @click="cancelRejectComment">
          Cancel
        </v-btn>
        <v-btn color="red" small @click="reject">Reject</v-btn>
        <v-spacer />
      </template>
    </CUModal>
  </v-row>
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
import reservation from '@/services/reservation'

@Component
export default class BookingDetailHeader extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]

  isDialogOpen = false
  rejectComment = ''

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

  cancelRejectComment(): void {
    this.rejectComment = ''
    this.isDialogOpen = false
  }

  async accept(): Promise<void> {
    await reservation.accept(this.reservation.reservationId)
    this.$emit('refresh')
  }

  async reject(): Promise<void> {
    await reservation.reject(this.reservation.reservationId)
    this.$emit('refresh')
  }
}
</script>
