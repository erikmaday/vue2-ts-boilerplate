<template>
  <v-row>
    <v-col class="white-space-nowrap padding-r-0 margin-r-0 padding-b-0">
      <template v-if="bidDetail.getShowLoaders">
        <CUSkeletonLoader
          type="h2"
          width="40%"
          class="d-inline-flex margin-r-2"
        />
        <CUSkeletonLoader
          type="h2"
          width="20px"
          class="d-inline-flex margin-r-2"
        />
        <CUSkeletonLoader type="h2" width="40%" class="d-inline-flex" />
      </template>
      <template v-else>
        <h2>
          {{ firstPickupCity }}
          <span class="text-gray-light">></span>
          {{ firstDropoffCity }}
        </h2>
      </template>
    </v-col>
    <v-col class="shrink margin-l-3 padding-l-0 padding-b-0">
      <v-chip v-if="bidDetail.getIsSoldOut" label color="error">
        Sold Out
      </v-chip>
    </v-col>
    <v-col cols="12" class="padding-t-0">
      <CUSkeletonLoader
        v-if="bidDetail.getShowLoaders"
        type="text"
        width="80%"
      />
      <p v-else>{{ formattedStartDateTime }}</p>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import bidDetail from '@/store/modules/bidDetail'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailHeader extends Vue {
  bidDetail = bidDetail

  get firstPickupCity(): string {
    return bidDetail.getTrip?.stops[0].address.city
  }

  get firstDropoffCity(): string {
    return bidDetail.getTrip?.stops?.[1]?.address?.city || this.firstPickupCity
  }

  get formattedStartDateTime(): string {
    const datetime = this.$dayjs(bidDetail.getTrip.startDate).tz(
      bidDetail.getTrip?.stops[0].address.timeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }
}
</script>
