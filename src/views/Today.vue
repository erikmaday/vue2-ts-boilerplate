<template>
  <div class="h-full background-black-true">
    <section class="background-white">
      <TodayBookings
        :style="{ 'max-width': `${$vuetify.breakpoint.thresholds.md}px` }"
      />
    </section>
    <section class="background-black-true">
      <TodayMarketplace
        :style="{ 'max-width': `${$vuetify.breakpoint.thresholds.md}px` }"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TodayBookings from '@/components/TodayBookings.vue'
import TodayMarketplace from '@/components/TodayMarketplace.vue'

@Component({
  components: {
    TodayBookings,
    TodayMarketplace,
  },
})
export default class Today extends Vue {}
</script>
