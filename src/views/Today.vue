<template>
  <div class="h-full">
    <!--
      ADD THIS BACK LATER WHEN WE CALCULATE THESE METRICS
      <section class="background-gray-header">
        <TodayMetrics />
      </section>
    -->
    <section>
      <TodayBookings />
    </section>
    <section class="background-black-true">
      <TodayMarketplace />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TodayBookings from '@/components/TodayBookings.vue'
import TodayMarketplace from '@/components/TodayMarketplace.vue'
// import TodayMetrics from '@/components/TodayMetrics.vue'

@Component({
  components: {
    TodayBookings,
    TodayMarketplace,
    // TodayMetrics,
  },
})
export default class Today extends Vue {}
</script>
