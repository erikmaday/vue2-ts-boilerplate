<template>
  <v-col class="grow padding-r-10 padding-b-0">
    <MarketplaceCard
      v-for="(trip, tripIndex) in trips"
      :trip="trip"
      :key="`${trip.tripId}-${tripIndex}`"
      class="margin-b-4 last-of-type:margin-b-0"
      @select="$emit('select', $event)"
    />
  </v-col>
</template>

<script lang="ts">
import { Trip } from '@/models/dto'
import { Vue, Component, Prop } from 'vue-property-decorator'
import MarketplaceCard from '@/components/MarketplaceCard.vue'

@Component({ components: { MarketplaceCard } })
export default class BidDetailMultiSidebar extends Vue {
  @Prop({ required: true }) readonly trips!: Trip[]
}
</script>
