<template>
  <v-card @click="goToBooking" class="border-radius-2x">
    <v-card-text class="padding-a-4">
      <p class="font-medium margin-t-0">
        {{ reservation.firstPickupAddress.city }}
        <span class="text-gray-light">></span>
        {{ reservation.firstDropoffAddress.city }}
      </p>
      <p class="font-14 margin-t-0">{{ formattedStartDateTime }}</p>
      <div class="d-inline-flex margin-t-4 margin-b-2">
        <VehicleAssignmentIcons
          :reservation="reservation"
          class="margin-r-4 h-32"
        />
        <DriverAssignmentIcons :reservation="reservation" />
      </div>
      <v-row class="align-end">
        <p class="col shrink white-space-nowrap font-bold font-18">
          {{ price }}
        </p>
        <v-spacer v-if="actionMessage" />
        <p
          v-if="actionMessage"
          class="col shrink white-space-nowrap font-bold font-12 text-error"
        >
          {{ actionMessage }}
        </p>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VehicleAssignmentIcons from '@/components/VehicleAssignmentIcons.vue'
import DriverAssignmentIcons from '@/components/DriverAssignmentIcons.vue'
import { Reservation } from '@/models/dto'
import { ReferralStatus } from '@/utils/enum'
import { roundedCurrencyFilter } from '@/utils/string'
import dayjs from 'dayjs'

@Component({
  components: {
    VehicleAssignmentIcons,
    DriverAssignmentIcons,
  },
})
export default class BookingCard extends Vue {
  @Prop() readonly reservation!: Reservation

  get needsAssignment(): boolean {
    return (
      this.reservation.assignedDriverPercentage < 100 ||
      this.reservation.assignedVehiclePercentage < 100
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

  get formattedStartDateTime(): string {
    const datetime = this.$dayjs(this.reservation.startDate).tz(
      this.reservation.firstStopAddressTimeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  get price(): string {
    return roundedCurrencyFilter(this.reservation.customerTotal)
  }

  goToBooking(): void {
    this.$router.push({
      name: 'booking-detail',
      params: { id: this.reservation.reservationId.toString() },
    })
  }
}
</script>
