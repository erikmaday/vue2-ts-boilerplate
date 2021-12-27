<template>
  <v-col class="grow padding-r-10 padding-b-0">
    <MarketplaceCard
      v-for="(trip, tripIndex) in bidDetail.trips"
      :trip="trip"
      :key="`${trip.tripId}-${tripIndex}`"
      class="margin-b-4 last-of-type:margin-b-0"
    />
    <v-btn
      small
      color="primary"
      :disabled="!areAllBidsComplete"
      class="margin-t-4 w-full"
      @click="submit"
    >
      Submit Bids
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MarketplaceCard from '@/components/MarketplaceCard.vue'
import bidDetail from '@/store/modules/bidDetail'
import { BidStatusId } from '@/utils/enum'
import { BidPayload, BidPayloadVehicle, Trip } from '@/models/dto'
import auth from '@/store/modules/auth'
import bid from '@/services/bid'

@Component({ components: { MarketplaceCard } })
export default class BidDetailMultiSidebar extends Vue {
  bidDetail = bidDetail

  get areAllBidsComplete(): boolean {
    let isComplete = false
    if (bidDetail.getTrips) {
      isComplete = true
      const tripIds = bidDetail.getTrips.map((trip) => trip.tripId)
      for (const tripId of tripIds) {
        if (!bidDetail.getBidAmounts?.[tripId]) {
          isComplete = false
          break
        }
      }
    }
    return isComplete
  }

  buildPayload(trip: Trip): BidPayload {
    const newBidPayload = {
      active: true,
      bidAmount: bidDetail.getBidAmounts?.[trip.tripId],
      bidPassengerCount:
        // bidDetail.getBid?.bidPassengerCount ||
        trip.passengerCount,
      bidStatusId: BidStatusId.Pending,
      bidVehicles: this.buildBidVehicles(trip),
      companyId: auth.getUser.companyId,
      driverCount:
        // bidDetail.getBid?.driverCount ||
        trip.requiredDrivers,
      providerNotes: null,
      tripId: trip.tripId,
      userId: auth.getUserId,
      existingBid: 0,
    }
    const originalBidPayload = {
      active: true,
      bidAmount: 0,
      bidPassengerCount:
        // bidDetail.getBid?.bidPassengerCount ||
        trip.passengerCount,
      bidStatusId: BidStatusId.Pending,
      bidVehicles: this.buildBidVehicles(trip),
      companyId: auth.getUser.companyId,
      driverCount:
        // bidDetail.getBid?.driverCount ||
        trip.requiredDrivers,
      providerNotes: null,
      tripId: trip.tripId,
      userId: auth.getUserId,
      existingBid: 0,
    }
    return { ...newBidPayload, existingBid: originalBidPayload }
  }

  buildBidVehicles(trip: Trip): BidPayloadVehicle[] {
    return trip.vehicles.map((vehicle) => {
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

  async submit(): void {
    for (const trip of bidDetail.getTripDetails) {
      const payload = this.buildPayload(trip)
      await bid.create(payload)
    }
  }
}
</script>
