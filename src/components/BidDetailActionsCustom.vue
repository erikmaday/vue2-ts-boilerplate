<template>
  <div>
    <v-text-field
      outlined
      v-mask="[...currencyMask]"
      v-model="customBidPrice"
      prepend-inner-icon="mdi-currency-usd"
      class="text-align-center"
      hide-details
    />
    <p
      v-if="awardedPriceFormatted"
      class="font-14 text-gray-light text-align-center padding-t-0"
    >
      Actual awarded price would be {{ awardedPriceFormatted }}
    </p>
    <v-btn
      color="primary"
      small
      class="w-full margin-t-4"
      :loading="submitting"
      @click="submit"
    >
      Submit
    </v-btn>
    <v-btn
      color="primary"
      text
      small
      class="w-full margin-t-4"
      :loading="submitting"
      @click="cancelCustomBid"
    >
      Cancel
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { currency as currencyMask } from '@/utils/mask'
import { currencyFilter } from '@/utils/string'
import auth from '@/store/modules/auth'
import { Bid, BidPayload, BidPayloadVehicle, Trip } from '@/models/dto'
import { BidStatusId } from '@/utils/enum'
import bid from '@/services/bid'

@Component
export default class BidDetailActionsCustom extends Vue {
  @Prop({ required: true }) readonly trip!: Trip | null
  @Prop({ required: true }) readonly bid!: Bid | null

  customBidPrice: string | null = null
  currencyMask = currencyMask
  submitting = false

  mounted(): void {
    if (this.bid) {
      this.customBidPrice = currencyFilter(this.bid.bidAmount).replace('$', '')
    }
  }

  get customBidRawValue(): number | null {
    if (this.customBidPrice) {
      return parseFloat(this.customBidPrice.replace(',', ''))
    }
    return null
  }

  get awardedPriceFormatted(): string | null {
    const takeRate = this.bid?.takeRate || 10
    const operatorTakePercent = (100 - takeRate) / 100
    if (this.customBidRawValue) {
      return currencyFilter(this.customBidRawValue * operatorTakePercent)
    }
    return null
  }

  cancelCustomBid(): void {
    this.$emit('cancel-custom-bid')
    this.enterCustomBid = false
  }

  buildBidVehicles(): BidPayloadVehicle[] {
    return this.trip?.vehicles.map((vehicle) => {
      const vehicleType = {
        active: true,
        companyId: null,
        ...vehicle.vehicleType,
      }
      return {
        quantity: vehicle.quantity,
        vehicleId: vehicle.vehicleId,
        vehicleType: vehicleType,
      }
    })
  }

  buildPayload(): BidPayload {
    return {
      active: true,
      bidAmount: this.customBidRawValue,
      bidPassengerCount:
        this.bid?.bidPassengerCount || this.trip?.passengerCount,
      bidStatusId: BidStatusId.Pending,
      bidVehicles: this.buildBidVehicles(),
      companyId: parseInt(auth.getUser?.companyId),
      driverCount: this.bid?.driverCount || this.trip?.requiredDrivers,
      providerNotes: null,
      tripId: this.trip.tripId,
      userId: auth.userId,
    }
  }

  async submit(): Promise<void> {
    this.submitting = true
    try {
      const payload = this.buildPayload()
      if (this.bid) {
        await bid.update(this.bid.bidId, payload)
      } else {
        await bid.create(payload)
      }
      this.$emit('update')
    } catch (err) {
      console.error(err)
    }
    this.submitting = false
  }
}
</script>

<style lang="scss" scoped>
::v-deep input {
  text-align: center;
}
</style>
