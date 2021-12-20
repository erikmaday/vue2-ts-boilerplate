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
import { Trip } from '@/models/dto'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BidDetailHeader extends Vue {
  @Prop({ required: true }) readonly trip!: Trip

  get firstPickupCity(): string {
    return this.trip?.stops[0].address.city
  }

  get firstDropoffCity(): string {
    return this.trip?.stops[1].address.city || this.firstPickupCity
  }

  get formattedStartDateTime(): string {
    const datetime = this.$dayjs(this.trip.startDate).tz(
      this.trip?.stops[0].address.timeZone
    )
    return `${datetime.format('MM/DD/YYYY')} • ${datetime.format('h:mm a')}`
  }
}
</script>
