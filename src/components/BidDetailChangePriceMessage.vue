<template>
  <v-col
    class="grow padding-r-10"
    :class="{
      'padding-b-4': $vuetify.breakpoint.smAndUp,
      'padding-b-6': $vuetify.breakpoint.xs,
    }"
  >
    <v-row>
      <v-col cols="12">
        <h3>Update Rates</h3>
      </v-col>
      <v-col cols="12">
        This bid was automatically calculated using your rates. To update
        pricing on new bids, click
        <router-link :to="{ name: 'rates' }">Rates</router-link>
        to update. All updates to rates are subject to a 48-hour review period,
        though new rates could take effect sooner.
      </v-col>
    </v-row>
  </v-col>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class BidDetailChangePriceMessage extends Vue {}
</script>
