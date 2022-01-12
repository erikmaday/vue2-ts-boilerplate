<template>
  <v-card class="border w-full cursor-pointer border-radius-2x">
    <v-card-text
      class="padding-x-4 padding-t-4"
      :class="{ 'padding-b-4': !showPagination, 'padding-b-1': showPagination }"
      @click="goToBid"
    >
      <p class="font-medium margin-t-0">
        {{ firstPickup.address.city }}
        <span class="text-gray-light">></span>
        {{ firstDropoff.address.city }}
      </p>
      <p class="font-14 margin-t-0 margin-b-3">
        {{ formattedStartDateTime }}
      </p>
      <div class="d-flex align-start font-14">
        <CUIcon class="text-gray-mid-light margin-r-2">directions_bus</CUIcon>
        <span class="white-space-pre">{{ formattedRequiredVehicles }}</span>
      </div>
      <div class="d-flex align-center font-14">
        <CUIcon class="text-gray-mid-light margin-r-2">person</CUIcon>
        {{ formattedRequiredDrivers }}
      </div>
      <div class="d-flex justify-end">
        <span
          v-if="isSoldOut && !bidAmount"
          class="text-error font-bold font-16"
        >
          Sold Out
        </span>
        <div
          v-else-if="promptBid"
          class="
            d-flex
            white-space-nowrap
            font-bold font-16
            text-primary
            align-middle
            margin-a-0
            padding-a-0
            justify-end
          "
        >
          Bid
          <CUIcon class="margin-l-1">arrow_right</CUIcon>
        </div>
        <div v-else-if="bidAmount" class="text-success font-bold font-16">
          {{ currency(bidAmount) }}
        </div>
        <span
          v-else-if="actionMessage"
          class="white-space-nowrap font-bold font-12 text-error"
          :class="`text-${actionMessage.color}`"
        >
          {{ actionMessage.text }}
        </span>
      </div>
    </v-card-text>
    <v-card-actions v-if="showPagination" class="padding-t-0">
      <v-row class="justify-center margin-a-0 h-24">
        <Pagination
          v-if="tripsList.length > 1"
          v-model="pagination"
          active-color="gray-light"
          inactive-color="gray-border"
          hover-color="gray-mid-light"
          :items="tripsList"
        />
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'

import { ColoredMessage } from '@/models/ColoredMessage'
import {
  RequiredVehicle,
  Stop,
  TableViewTrip,
  TableViewTripStop,
  Trip,
} from '@/models/dto'
import Pagination from '@/components/Pagination.vue'

import { currencyFilter, pluralize } from '@/utils/string'
import { timeDifferenceAsObject, timeObjectToString } from '@/utils/time'
import bidDetail from '@/store/modules/bidDetail'

@Component({ components: { Pagination } })
export default class MarketplaceCard extends Vue {
  @Inject({ from: 'isInBidDetail', default: false })
  readonly isInBidDetail!: boolean

  @Prop({ required: false }) readonly trip: Trip
  @Prop({ required: false }) readonly trips: TableViewTrip[]
  @Prop({ type: Boolean, required: false, default: false })
  readonly showPagination: boolean

  currency = currencyFilter
  bidAmounts = bidDetail.getBidAmounts

  pagination = {
    pageSize: 1,
    currentPage: 1,
    breakpointSizes: {
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1,
      xl: 1,
    },
  }

  get activeTripIndex(): number {
    return this.pagination.currentPage - 1
  }

  get activeTrip(): Trip | TableViewTrip {
    if (this.trips) {
      return this.trips[this.activeTripIndex]
    }
    return this.trip
  }

  get tripsList(): Trip[] | TableViewTrip[] {
    if (this.trips) {
      return this.trips
    }
    return [this.trip]
  }

  get actionMessage(): ColoredMessage {
    const now = (this as any).$dayjs.utc()
    const expiration = (this as any).$dayjs(this.activeTrip.biddingEndDate)
    const diff = timeDifferenceAsObject(now, expiration)

    return {
      text: `Expires in ${timeObjectToString(diff)}`,
      color: diff.days <= 0 ? 'error' : 'gray-light',
    }
  }

  get promptBid(): boolean {
    return this.isInBidDetail && !this.bidAmount
  }

  get isSoldOut(): boolean {
    return this.isInBidDetail && bidDetail.getBids?.[this.trip.tripId]?.soldOut
  }

  get bidAmount(): number | null {
    return this.isInBidDetail ? this.bidAmounts[this.activeTrip.tripId] : null
  }

  get firstPickup(): Stop | TableViewTripStop {
    return this.activeTrip.stops[0]
  }

  get firstDropoff(): Stop | TableViewTripStop {
    return this.activeTrip.stops?.[1] || this.firstPickup
  }

  get formattedStartDateTime(): string {
    const datetime = (this as any)
      .$dayjs(this.firstPickup.pickupDate)
      .tz(this.firstPickup.address.timeZone)
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }

  get requiredVehicles(): RequiredVehicle[] {
    return this.activeTrip.requiredVehicles || []
  }

  get formattedRequiredDrivers(): string {
    return `${this.activeTrip.requiredDrivers} ${pluralize(
      this.activeTrip.requiredDrivers,
      'Driver'
    )}`
  }

  get formattedRequiredVehicles(): string {
    let string = ''
    for (const vehicle of this.requiredVehicles) {
      string = `${string}${vehicle.requiredVehicles} ${pluralize(
        vehicle.requiredVehicles,
        vehicle.vehicleType
      )}\n`
    }
    return string
  }

  goToBid(): void {
    if (this.isInBidDetail) {
      bidDetail.selectTrip(this.activeTrip.tripId)
    } else {
      const name = 'bid-detail'
      const id = this.activeTrip.quoteId
      this.$router.push({ name, params: { id: id.toString() } })
    }
  }
}
</script>
