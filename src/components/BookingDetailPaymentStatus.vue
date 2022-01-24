<template>
  <v-row>
    <v-col class="shrink">
      <CUSkeletonLoader v-if="loading" type="h3" width="135px" />
      <h3 v-else class="font-18 white-space-nowrap">Payment Status</h3>
    </v-col>
    <v-col class="shrink">
      <CUSkeletonLoader
        v-if="loading"
        height="25px"
        width="64px"
        classes="border-radius-2"
      />
      <v-chip
        v-else
        small
        :color="paymentStatus.color"
        text-color="white"
        class="font-medium padding-x-2 font-12 border-radius-2"
      >
        {{ paymentStatus.text }}
      </v-chip>
    </v-col>
    <v-col cols="12" class="shrink padding-t-0">
      <v-list>
        <v-list-item
          v-for="(payment, paymentIndex) in paymentsSummary"
          :key="`payment-${paymentIndex}`"
          class="border-solid border-gray-border first-of-type:border-radius-top-left-regular first-of-type:border-radius-top-right-regular first-of-type:border-t-1 border-r-1 border-l-1 border-b-1 border-t-0 last-of-type:font-medium last-of-type:border-radius-bottom-left-regular last-of-type:border-radius-bottom-right-regular last-of-type:background-gray-border"
        >
          <CUSkeletonLoader v-if="loading" type="text" width="125px" multiply />
          <p v-else class="d-flex margin-t-0">{{ payment.label }}</p>
          <v-spacer />
          <CUSkeletonLoader v-if="loading" type="text" width="125px" multiply />
          <p v-else class="d-flex margin-t-0">
            {{ currencyFilter(payment.amount) }}
          </p>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ColoredMessage } from '@/models/ColoredMessage'
import { PaymentSummary, ReservationDetail } from '@/models/dto'
import { PaymentStatus } from '@/utils/enum'
import { currencyFilter, toTitle } from '@/utils/string'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BookingDetailPaymentStatus extends Vue {
  @Prop({ required: true }) readonly reservation!: ReservationDetail
  @Prop({ required: true }) readonly loading!: boolean

  get paymentStatus(): ColoredMessage {
    let status = {
      text: '',
      color: 'black',
    }
    if (this.reservation?.referralPaymentStatus) {
      if (this.reservation.referralPaymentStatus === PaymentStatus.FullyPaid) {
        status.color = 'green'
      }
      status.text = toTitle(this.reservation.referralPaymentStatus)
    }
    return status
  }

  get bidPrice(): number | null {
    const bidAmount = 7380.0
    return bidAmount
  }

  get serviceFee(): number | null {
    const serviceAmount = -615.0
    return serviceAmount
  }

  get total(): number | null {
    const bidAmount = 7380.0
    const serviceAmount = -615.0
    return bidAmount + serviceAmount
  }

  get paymentsSummary(): { label: string; amount: number }[] {
    const paymentsSummary = this.reservation?.paymentsSummary
    let total = 0
    const summary = paymentsSummary.map((payment, paymentIndex) => {
      const label = this.getPaymentLabel(payment, paymentIndex)
      const amount = payment.amount
      total += amount
      return { label, amount }
    })
    summary.push({ label: 'New Total', amount: total })
    return summary
  }

  getPaymentLabel(payment: PaymentSummary, paymentIndex: number): string {
    if (paymentIndex === 0) {
      return 'Bid Price'
    } else if (payment.notes.includes('CharterUP fee')) {
      return 'CharterUP Fee'
    }
    return payment.notes
  }

  currencyFilter = currencyFilter
}
</script>
