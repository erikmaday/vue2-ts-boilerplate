<template>
  <div>
    {{ displayText }}
    <v-tooltip top v-if="isMultiTrip">
      <template #activator="{ on }">
        <div
          v-on="on"
          color="primary"
          class="d-inline-flex margin-l-1 cursor-pointer background-primary padding-x-2 text-white"
          :class="{
            'border-radius-12': !isMobile,
            'border-radius-2 font-14': isMobile,
          }"
        >
          {{ row.totalTrips }}
          <span v-if="isMobile" class="margin-l-1">Trips</span>
        </div>
      </template>
      <span class="text-white">
        {{ tooltipText }}
      </span>
    </v-tooltip>
  </div>
</template>
<script lang="ts">
import { TableViewTrip } from '@/models/dto'
import { numberToString } from '@/utils/string'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class MarketplacePickupDestination extends Vue {
  @Prop({ required: true }) readonly row: TableViewTrip
  @Prop({ required: true }) readonly isMobile: boolean

  get displayText(): string {
    const firstPickup = this.row.stops?.[0]?.address?.city
    const firstDropoff = this.row.stops?.[1]?.address?.city || firstPickup

    return `${firstPickup} > ${firstDropoff}`
  }

  get isMultiTrip(): boolean {
    return this.row.totalTrips > 1
  }

  get tooltipText(): string {
    if (!this.isMultiTrip) {
      return ''
    }
    return `This opportunity has ${numberToString(this.row.totalTrips)} trips.`
  }
}
</script>
