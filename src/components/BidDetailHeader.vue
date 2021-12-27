<template>
  <div>
    <h2>
      {{ firstPickupCity }}
      <span class="text-gray-light">></span>
      {{ firstDropoffCity }}
    </h2>
    <p>{{ formattedStartDateTime }}</p>
  </div>
</template>

<script lang="ts">
import bidDetail from '@/store/modules/bidDetail'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailHeader extends Vue {
  get firstPickupCity(): string {
    return bidDetail.getTrip?.stops[0].address.city
  }

  get firstDropoffCity(): string {
    return bidDetail.getTrip?.stops[1].address.city || this.firstPickupCity
  }

  get formattedStartDateTime(): string {
    const datetime = this.$dayjs(bidDetail.getTrip.startDate).tz(
      bidDetail.getTrip?.stops[0].address.timeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }
}
</script>
