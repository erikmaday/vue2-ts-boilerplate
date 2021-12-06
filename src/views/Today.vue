<template>
  <div>
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

@Component({
  components: {
    TodayBookings,
    TodayMarketplace,
  },
})
export default class Today extends Vue {}
</script>
