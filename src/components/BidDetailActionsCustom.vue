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
      :loading="saving"
      @click="handleSave"
    >
      {{ submitButtonText }}
    </v-btn>
    <v-btn
      color="primary"
      text
      small
      class="w-full margin-t-4"
      :loading="saving"
      @click="bidDetail.setIsEnteringBid(false)"
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
import { BidPayload, BidPayloadVehicle } from '@/models/dto'
import { BidStatusId } from '@/utils/enum'
import bid from '@/services/bid'
import bidDetail from '@/store/modules/bidDetail'

@Component
export default class BidDetailActionsCustom extends Vue {
  @Prop({ required: true }) readonly isMultiBid!: boolean

  customBidPrice: string | null = null
  currencyMask = currencyMask
  saving = false
  bidDetail = bidDetail

  mounted(): void {
    const bidAmount =
      bidDetail.getBidAmounts[bidDetail.getTrip?.tripId] ||
      bidDetail.getBid?.bidAmount
    if (bidAmount) {
      this.customBidPrice = currencyFilter(bidAmount).replace('$', '')
    }
  }

  get customBidRawValue(): number | null {
    if (this.customBidPrice) {
      return parseFloat(this.customBidPrice.replace(',', ''))
    }
    return null
  }

  get awardedPriceFormatted(): string | null {
    const takeRate = bidDetail.getBid?.takeRate || 10
    const operatorTakePercent = (100 - takeRate) / 100
    if (this.customBidRawValue) {
      return currencyFilter(this.customBidRawValue * operatorTakePercent)
    }
    return null
  }

  get submitButtonText(): string {
    return this.isMultiBid ? 'Save' : 'Submit'
  }

  buildBidVehicles(): BidPayloadVehicle[] {
    return bidDetail.getTrip?.vehicles.map((vehicle) => {
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
      bidAmount: bidDetail.getBidAmounts?.[bidDetail.getTrip?.tripId],
      bidPassengerCount:
        bidDetail.getBid?.bidPassengerCount ||
        bidDetail.getTrip?.passengerCount,
      bidStatusId: BidStatusId.Pending,
      bidVehicles: this.buildBidVehicles(),
      companyId: parseInt(auth.getUser?.companyId),
      driverCount:
        bidDetail.getBid?.driverCount || bidDetail.getTrip?.requiredDrivers,
      providerNotes: null,
      tripId: bidDetail.getTrip?.tripId,
      userId: auth.userId,
    }
  }

  handleSave(): void {
    this.saving = true
    if (this.isMultiBid) {
      bidDetail.setTripBidAmount({
        tripId: bidDetail.getTrip?.tripId,
        bidAmount: this.customBidRawValue,
      })
      bidDetail.setIsEnteringBid(false)
    } else {
      this.submit()
    }
    this.saving = false
  }

  async submit(): Promise<void> {
    bidDetail.setTripBidAmount({
      tripId: bidDetail.getTrip?.tripId,
      bidAmount: this.customBidRawValue,
    })
    try {
      const payload = this.buildPayload()
      if (bidDetail.getBid) {
        await bid.update(bidDetail.getBid.bidId, payload)
      } else {
        await bid.create(payload)
      }
      await bidDetail.fetchExistingBids()
      bidDetail.setIsEnteringBid(false)
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep input {
  text-align: center;
}
</style>
