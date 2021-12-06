<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <h3
            class="
              col
              shrink
              white-space-nowrap
              font-book font-weight-400
              text-white
              font-20
            "
          >
            Marketplace
          </h3>
          <v-spacer />
          <p
            class="
              col
              shrink
              white-space-nowrap
              text-white
              font-14 font-medium
              text-decoration-underline
              cursor-pointer
            "
          >
            All Bids (30)
          </p>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-chip
              v-for="(filter, filterIndex) in marketplaceFilters"
              color="white"
              :text-color="filter.active ? 'black-true' : 'white'"
              :outlined="!filter.active"
              class="margin-r-2 cursor-pointer margin-b-2"
              :key="`marketplace-filter-${filterIndex}`"
              @click="filter.active = !filter.active"
            >
              {{ filter.label }} ({{ filter.count }})
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class TodayMarketplace extends Vue {
  marketplaceFilters = [
    {
      label: 'Created Today',
      count: 4,
      value: null,
      active: false,
    },
    {
      label: 'Ending Today',
      count: 1,
      value: null,
      active: false,
    },
  ]
}
</script>
