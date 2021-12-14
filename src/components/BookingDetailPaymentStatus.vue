<template>
  <v-row>
    <v-col class="shrink">
      <h3 class="font-18 white-space-nowrap">Payment Status</h3>
    </v-col>
    <v-col class="shrink">
      <v-chip
        small
        color="black"
        text-color="white"
        class="font-medium padding-x-2 font-12 border-radius-2"
      >
        {{ paymentStatus }}
      </v-chip>
    </v-col>
    <v-col cols="12" class="shrink padding-t-0">
      <v-list>
        <v-list-item
          v-for="(payment, paymentIndex) in payments"
          :key="`payment-${paymentIndex}`"
          class="
            border-solid border-gray-border
            first-of-type:border-radius-top-left-regular
            first-of-type:border-radius-top-right-regular
            first-of-type:border-t-1
            border-r-1 border-l-1 border-b-1 border-t-0
            last-of-type:font-medium
            last-of-type:border-radius-bottom-left-regular
            last-of-type:border-radius-bottom-right-regular
            last-of-type:background-gray-border
          "
        >
          <p class="d-flex margin-t-0">{{ payment.label }}</p>
          <v-spacer />
          <p class="d-flex margin-t-0">{{ currencyFilter(payment.amount) }}</p>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ReservationDetail } from '@/models/dto'
import { currencyFilter, toTitle } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BookingDetailPaymentStatus extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail

  get paymentStatus(): string | null {
    if (this.reservation?.referralPaymentStatus) {
      return toTitle(this.reservation.referralPaymentStatus)
    }
    return null
  }

  get bidPrice(): string | null {
    const bidAmount = 7380.0
    return bidAmount
  }

  get serviceFee(): string | null {
    const serviceAmount = -615.0
    return serviceAmount
  }

  get total(): string | null {
    const bidAmount = 7380.0
    const serviceAmount = -615.0
    return bidAmount + serviceAmount
  }

  get payments(): { label: string; amount: string }[] {
    return [
      { label: 'Bid Price', amount: this.bidPrice },
      { label: 'CharterUP Fee', amount: this.serviceFee },
      { label: 'New Total', amount: this.total },
    ]
  }

  currencyFilter = currencyFilter
}
</script>
